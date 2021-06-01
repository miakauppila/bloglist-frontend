import blogService from '../services/blogs'
import { notificationAction } from './notificationReducer'

const initialState = []

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.payload
  case 'NEW_BLOG':
    return [...state, action.payload]
  case 'LIKE_BLOG': {
    const id = action.payload.id
    const likedBlog = action.payload
    return state.map(blog =>
      blog.id !== id ? blog : { ...blog, likes: likedBlog.likes }
    )
  }
  case 'REMOVE_BLOG': {
    const id = action.payload
    return state.filter(blog => blog.id !== id)
  }
  case 'COMMENT_BLOG': {
    const id = action.payload.id
    const commentedBlog = action.payload
    return state.map(blog =>
      blog.id !== id ? blog : { ...blog, comments: commentedBlog.comments }
    )
  }
  default:
    return state
  }
}

// async action creator makes axios call
export const initializeBlogsAction = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      dispatch({
        type: 'INIT_BLOGS',
        payload: blogs
      })
    }
    catch (exception) {
      console.log(exception)
      dispatch(notificationAction('Sorry, connection error!', 'danger', 10))
    }
  }
}

export const createBlogAction = (blogObj) => {
  return {
    type: 'NEW_BLOG',
    payload: blogObj
  }
}

export const likeBlogAction = (blogObj) => {
  return {
    type: 'LIKE_BLOG',
    payload: blogObj
  }
}

export const removeBlogAction = (id) => {
  return {
    type: 'REMOVE_BLOG',
    payload: id
  }
}

export const commentBlogAction = (blogObj) => {
  return {
    type: 'COMMENT_BLOG',
    payload: blogObj
  }
}

export default blogReducer