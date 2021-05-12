import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from './reducers/notificationReducer'
import loggedReducer from './reducers/loggedReducer'
import blogReducer from './reducers/blogReducer'
import usersReducer from './reducers/userReducer'

const rootReducer = combineReducers({
  loggedUser: loggedReducer,
  blogs: blogReducer,
  notification: notificationReducer,
  users: usersReducer
})

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store