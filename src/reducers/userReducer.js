import userService from '../services/users'
import { notificationAction } from './notificationReducer'

const initialState = []

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.payload
  default:
    return state
  }
}

// async action creator makes axios call
export const initializeUsersAction = () => {
  return async dispatch => {
    try {
      const users = await userService.getAll()
      dispatch({
        type: 'INIT_USERS',
        payload: users
      })
    }
    catch (exception) {
      console.log(exception)
      dispatch(notificationAction('Sorry, connection error!', 'danger', 10))
    }
  }
}

export default userReducer