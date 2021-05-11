const initialState = null

const notificationReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
  case 'SHOW_NOTIFICATION':
    return action.payload
  case 'CLOSE_NOTIFICATION':
    return initialState
  default:
    return state
  }
}

export const showNotificationAction = (message) => {
  return {
    type: 'SHOW_NOTIFICATION',
    payload: message
  }
}

export const closeNotificationAction = () => {
  return {
    type: 'CLOSE_NOTIFICATION'
  }
}

//async action creator handles both show & close
let timeoutID = null
export const notificationAction = (message, type, seconds = 5) => {
  return async dispatch => {
    if (timeoutID) {
      // earlier setTimeout call will be canceled
      clearTimeout(timeoutID)
      timeoutID = null
    }
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: {
        message,
        type
      }
    })
    // each setTimeout creates a unique ID
    timeoutID = setTimeout(() =>
      dispatch({
        type: 'CLOSE_NOTIFICATION'
      }), seconds * 1000)
  }
}

export default notificationReducer