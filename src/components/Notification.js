import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  // Redux store: notification details or null
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  return (
    <Alert variant={notification.type}>
      {notification.message}
    </Alert>
  )

}

export default Notification