import React, { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Users from './components/Users'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedUserAction, removeLoggedUserAction } from './reducers/loggedReducer'
import { initializeBlogsAction, createBlogAction } from './reducers/blogReducer'
import { notificationAction } from './reducers/notificationReducer'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'
import Bloglist from './components/Bloglist'

const App = () => {
  const dispatch = useDispatch()

  // Redux store: user saved after login success
  const loggedUser = useSelector(state => state.loggedUser)

  // used for linking with Togglable
  const blogFormRef = useRef()

  // runs once to initialize blogs
  useEffect(() => {
    dispatch(initializeBlogsAction())
  }, [dispatch])

  // check if user is logged in after page refresh
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setLoggedUserAction(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(removeLoggedUserAction())
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

  const padding = {
    padding: 5
  }

  if (loggedUser === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <h2>blogs</h2>
      <Notification />
      <div className="logout">
        {loggedUser.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <Switch>
        <Route path="/new">
          <NewBlogForm />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Bloglist />
          <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
            {/* NewBlogForm becomes the children of Togglable */}
            <NewBlogForm createNewBlog={createNewBlog} />
          </Togglable>
        </Route>
      </Switch>

    </Router>
  )
}

export default App