import React, { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlogAction, removeBlogAction } from '../reducers/blogReducer'
import { notificationAction } from '../reducers/notificationReducer'

const Blog = ({ blog }) => {
  //console.log('Blog renders', blog)
  //console.log('user', user)
  const [showBlogDetails, setShowBlogDetails] = useState(false)


  // Redux store: user saved after login success
  const user = useSelector(state => state.loggedUser)

  const dispatch = useDispatch()

  // empty display value '' does not affect display
  const hideWhenVisible = { display: showBlogDetails ? 'none' : '' }
  const showWhenVisible = { display: showBlogDetails ? '' : 'none' }

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

  const onRemoveHandler = async (blog) => {
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

  return (
    <div className="blog">
      <div className="blog-header" style={hideWhenVisible} >
        {blog.title} {blog.author} <button onClick={() => setShowBlogDetails(true)}>View</button>
      </div>
      <ul className="blog-details" style={showWhenVisible}>
        <li>{blog.title} {blog.author} <button onClick={() => setShowBlogDetails(false)}>Hide</button></li>
        <li>{blog.url}</li>
        <li>likes {blog.likes} <button id="like-button" onClick={() => updateBlog(blog)}>Like</button></li>
        <li>{blog.user.name}</li>
        {blog.user.username === user.username ?
          (<li> <button id="remove-button" onClick={() => onRemoveHandler(blog)}>Remove</button></li>)
          : null}
      </ul>
    </div>
  )
}

export default Blog