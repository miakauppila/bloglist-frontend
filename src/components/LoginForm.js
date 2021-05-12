import React, { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { setLoggedUserAction } from '../reducers/loggedReducer'
import loginService from '../services/login'
import { notificationAction } from '../reducers/notificationReducer'
import Notification from './Notification'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    setUsername('')
    setPassword('')
    try {
      const user = await loginService.login({
        username, password
      })
      dispatch(setLoggedUserAction(user))
      // store user in localStorage
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(notificationAction('Login success', 'success'))
    } catch (error) {
      console.log(error.response.data)
      dispatch(notificationAction('Wrong credentials', 'error'))
    }
  }

  return (
    <div className="login-page">
      <h2>Log in to application</h2>
      <Notification />
      <form id="login" onSubmit={handleLogin}>
        <div>
        username
          <input
            type="text"
            value={username}
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            type="password"
            value={password}
            id="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" id="login-button">login</button>
      </form>
    </div>
  )
}

export default LoginForm

