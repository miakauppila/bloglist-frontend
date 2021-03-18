import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // user is saved after login success
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // check if user is logged in after page refresh
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      // store user in localStorage
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setMessage('Login success')
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createNewBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({})
        setMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
      })
      .catch((error) => {
        console.log("Create new blog error:", error.response.data.error);
        setErrorMessage('Please fill in blog data');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }

  if (user === null) {
    return (
      <div className="loginForm">
        <h2>Log in to application</h2>
        <Notification message={message} errorMessage={errorMessage} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <div className="logout">
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <h2>create new</h2>
      <div className="createBlogForm">
        <form onSubmit={createNewBlog}>
          <div>
            title
            <input
              type="text"
              value={newBlog.title}
              name="title"
              onChange={({ target }) => setNewBlog({...newBlog, title: target.value })}
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={newBlog.author}
              name="author"
              onChange={({ target }) => setNewBlog({...newBlog, author: target.value })}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={newBlog.url}
              name="url"
              onChange={({ target }) => setNewBlog({...newBlog, url: target.value })}
            />
          </div>
          <button type="submit">create</button>
        </form>

      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App