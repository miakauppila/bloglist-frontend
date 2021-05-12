const initialState = null

const loggedReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
  case 'SET_USER':
    return action.payload
  case 'REMOVE_USER':
    return initialState
  default:
    return state
  }
}

export const setLoggedUserAction = (user) => {
  return {
    type: 'SET_USER',
    payload: user
  }
}

export const removeLoggedUserAction = () => {
  return {
    type: 'REMOVE_USER'
  }
}

export default loggedReducer