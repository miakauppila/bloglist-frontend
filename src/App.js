import React, { useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import blogService from './services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedUserAction } from './reducers/loggedReducer'
import { initializeBlogsAction } from './reducers/blogReducer'
import { initializeUsersAction } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom'
import Bloglist from './components/Bloglist'
import Blog from './components/Blog'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { Container } from 'react-bootstrap'

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

  // if (loggedUser === null) {
  //   return (
  //     <LoginForm />
  //   )
  // }

  return (
    <div>
      <Router>
        <Navigation />
        <Container>
          {loggedUser === null? <LoginForm />
            : (
              <Switch>
                <Route path="/blogs/:id">
                  <Blog />
                </Route>
                <Route path="/users">
                  <Users />
                </Route>
                <Route path="/">
                  <Bloglist />
                </Route>
              </Switch>
            )
          }
        </Container>
      </Router>
      <Footer />
    </div>
  )
}

export default App