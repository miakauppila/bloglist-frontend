import React from 'react'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlogAction, removeBlogAction } from '../reducers/blogReducer'
import { notificationAction } from '../reducers/notificationReducer'
import { useParams, useHistory } from 'react-router-dom'
import Notification from './Notification'

const Blog = () => {

  // Redux store: user saved after login success
  const user = useSelector(state => state.loggedUser)
  // Redux store: blogs
  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()

  const blogId = useParams().id
  const blog = blogs.find(blog => blog.id === blogId)

  const updateBlog = async (blogObject) => {
    const changedBlog = {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes + 1,
      user: blogObject.user.id
    }
    console.log('original', blogObject)
    console.log('changed', changedBlog)
    try {
      // likes have been increased but returned user has only id
      const likedBlog = await blogService.update(blogObject.id, changedBlog)
      dispatch(likeBlogAction(likedBlog))
      dispatch(notificationAction(`Likes of the blog ${likedBlog.title} updated`, 'success'))
    }
    catch(error) {
      console.log('Update blog error:', error)
      dispatch(notificationAction('Sorry, adding likes failed.', 'error'))
    }
  }

  const removeHandler = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      // when user chooses OK
      try {
        await blogService.remove(blog.id)
        dispatch(removeBlogAction(blog.id))
        dispatch(notificationAction('Blog was removed', 'success'))
      }
      catch(error) {
        console.log('Delete blog error:', error)
        dispatch(notificationAction('Sorry, remove failed.', 'error'))
      }
    }
  }

  const history = useHistory()
  const backHandler = () => {
    history.push('/')
  }

  if (!blog) {
    return null
  }

  return (
    <div className="blog">
      <Notification />
      <h2>{blog.title} {blog.author}</h2>
      <div className="blog-details">
        <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
        <div>{blog.likes} likes <button id="like-button" onClick={() => updateBlog(blog)}>Like</button></div>
        <div>added by {blog.user.name}</div>
        {blog.user.username === user.username ?
          (<div> <button id="remove-button" onClick={() => removeHandler(blog)}>Remove</button></div>)
          : null}
      </div>
      <button id="back-button" onClick={backHandler}>Back</button>
    </div>
  )
}

export default Blog