import React, { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  //console.log('Blog renders', blog)
  //console.log('user', user)
  const [showBlogDetails, setShowBlogDetails] = useState(false)

  // empty display value '' does not affect display
  const hideWhenVisible = { display: showBlogDetails ? 'none' : '' }
  const showWhenVisible = { display: showBlogDetails ? '' : 'none' }

  const onRemoveHandler = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      // when user chooses OK, call the props fn
      deleteBlog(blog.id)
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