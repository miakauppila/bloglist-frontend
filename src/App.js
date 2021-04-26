import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // user is saved after login success
  const [user, setUser] = useState(null)
  // used for linking with Togglable
  const blogFormRef = useRef()

  // runs once
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

  const handleLogin = async (username, password) => {
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
      setMessage('Login success')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createNewBlog = (blogObject) => {
    // access Togglable function via ref
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log('blog created:', returnedBlog)
        blogService.getAll().then(blogs =>
          setBlogs(blogs)
        )
        setMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        console.log('Create new blog error:', error.response.data.error)
        setErrorMessage('Please fill in blog data')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const updateBlog = (blogObject) => {
    const changedBlog = {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes+1,
      user: blogObject.user.id
    }
    console.log('original', blogObject)
    console.log('changed', changedBlog)
    blogService
      .update(blogObject.id, changedBlog)
      .then(returnedBlog => { // likes have been increased but user has only id
        setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : { ...blog, likes: returnedBlog.likes } ))
        setMessage(`Likes of the blog ${returnedBlog.title} updated`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        console.log('Update blog error:', error.response.data.error)
        setErrorMessage('Sorry, adding likes failed.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = (id) => {
    blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        setMessage('Blog was removed')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        console.log('Delete blog error:', error)
        setErrorMessage('Sorry, remove failed.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  // sort blogs by amount of likes
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} errorMessage={errorMessage} />
        <LoginForm handleLogin={handleLogin} />
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

      <div>
        <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
          {/* NewBlogForm becomes the children of Togglable */}
          <NewBlogForm createNewBlog={createNewBlog} />
        </Togglable>
      </div>

      <div className="blog-list">
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
        )}
      </div>

    </div>
  )
}

export default App