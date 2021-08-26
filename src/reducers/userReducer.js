import userService from '../services/users'
import { notificationAction } from './notificationReducer'

const initialState = []

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.payload
  case 'NEW_BLOG_BY_USER': {
    const userId = action.payload.user.id
    const newBlog = {
      title: action.payload.title,
      author: action.payload.author,
      url: action.payload.url,
      id: action.payload.id
    }
    return state.map(user =>
      user.id !== userId ? user : { ...user, blogs: [ ...user.blogs, newBlog ] }
    )
  }
  case 'BLOG_REMOVED_BY_USER': {
    const userId = action.payload.user.id
    const blogId = action.payload.id
    return state.map(user => user.id !== userId ? user :
      { ...user, blogs: user.blogs.filter(blog => blog.id !== blogId) }
    )
  }
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

export const newBlogByUserAction = (blogObj) => {
  return {
    type: 'NEW_BLOG_BY_USER',
    payload: blogObj,
  }
}

export const blogRemovedByUserAction = (blogObj) => {
  return {
    type: 'BLOG_REMOVED_BY_USER',
    payload: blogObj,
  }
}

export default userReducer