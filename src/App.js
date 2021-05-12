import React, { useEffect } from 'react'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Users from './components/Users'
import blogService from './services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedUserAction, removeLoggedUserAction } from './reducers/loggedReducer'
import { initializeBlogsAction } from './reducers/blogReducer'
import { initializeUsersAction } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'
import Bloglist from './components/Bloglist'
import Blog from './components/Blog'

const App = () => {
  const dispatch = useDispatch()

  // Redux store: user saved after login success
  const loggedUser = useSelector(state => state.loggedUser)

  // runs once to initialize blogs
  useEffect(() => {
    dispatch(initializeBlogsAction())
  }, [dispatch])

  // runs once to initialize users
  useEffect(() => {
    dispatch(initializeUsersAction())
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

  const padding = {
    padding: 5
  }

  if (loggedUser === null) {
    return (
      <LoginForm />
    )
  }

  return (
    <div>

      <Router>
        <div>
          <Link style={padding} to="/">blogs</Link>
          <Link style={padding} to="/users">users</Link>
          {loggedUser.name} logged in <button onClick={handleLogout}>logout</button>
        </div>

        <h2>blog app</h2>

        <Switch>
          <Route path="/blogs/:id">
            <Blog />
          </Route>
          <Route path="/new">
            <NewBlogForm />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Bloglist />
          </Route>
        </Switch>

      </Router>
    </div>
  )
}

export default App