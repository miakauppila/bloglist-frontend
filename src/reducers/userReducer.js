const initialState = null

const userReducer = (state = initialState, action) => {
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

export const setUserAction = (user) => {
  return {
    type: 'SET_USER',
    payload: user
  }
}

export const removeUserAction = () => {
  return {
    type: 'REMOVE_USER'
  }
}

export default userReducer