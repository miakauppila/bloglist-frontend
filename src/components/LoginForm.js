import React, { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { setUserAction } from '../reducers/userReducer'
import loginService from '../services/login'
import { notificationAction } from '../reducers/notificationReducer'

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
      dispatch(setUserAction(user))
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
    <div className="loginForm">
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

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm

