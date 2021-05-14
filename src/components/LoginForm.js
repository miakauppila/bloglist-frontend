import React, { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { setLoggedUserAction } from '../reducers/loggedReducer'
import loginService from '../services/login'
import { notificationAction } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'
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
      dispatch(notificationAction('Wrong credentials', 'danger'))
    }
  }

  return (
    <div className="container">
      <h2>Log in to application</h2>
      <Notification />
      <Form id="login" onSubmit={handleLogin}>
        <Form.Group controlId="username">
          <Form.Label>username:</Form.Label>
          <Form.Control type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" id="login-button">login</Button>
      </Form>
    </div>
  )
}

export default LoginForm

