import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setUserAction, removeUserAction } from './reducers/userReducer'
import { initializeBlogsAction, createBlogAction, removeBlogAction, likeBlogAction } from './reducers/blogReducer'
import { notificationAction } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()

  // Redux store: user saved after login success
  const user = useSelector(state => state.user)
  // Redux store: blogs
  const blogs = useSelector(state => state.blogs)

  // used for linking with Togglable
  const blogFormRef = useRef()

  // runs once to initialize blogs
  useEffect(() => {
    dispatch(initializeBlogsAction(blogs))
  }, [dispatch])

  // check if user is logged in after page refresh
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUserAction(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(removeUserAction())
  }

  const createNewBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      console.log('blog created:', newBlog)
      dispatch(createBlogAction(newBlog))
      // access Togglable function via ref
      blogFormRef.current.toggleVisibility()
      dispatch(notificationAction(`A new blog ${newBlog.title} by ${newBlog.author} added`, 'success'))
    }
    catch(error) {
      console.log('Create new blog error:', error)
      dispatch(notificationAction('Please fill in complete blog data', 'error'))
    }
  }

  const updateBlog = async (blogObject) => {
    const changedBlog = {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes + 1,
      user: blogObject.user.id
    }
    console.log('original', blogObject)
    console.log('changed', changedBlog)
    try {
      // likes have been increased but returned user has only id
      const likedBlog = await blogService.update(blogObject.id, changedBlog)
      dispatch(likeBlogAction(likedBlog))
      dispatch(notificationAction(`Likes of the blog ${likedBlog.title} updated`, 'success'))
    }
    catch(error) {
      console.log('Update blog error:', error)
      dispatch(notificationAction('Sorry, adding likes failed.', 'error'))
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      dispatch(removeBlogAction(id))
      dispatch(notificationAction('Blog was removed', 'success'))
    }
    catch(error) {
      console.log('Delete blog error:', error)
      dispatch(notificationAction('Sorry, remove failed.', 'error'))
    }
  }

  // sort blogs by amount of likes
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
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
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        )}
      </div>

    </div>
  )
}

export default App