import React, { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  //console.log('Blog renders', blog)
  //console.log('user', user)
  const [showBlog, setShowBlog] = useState(false)

  const onRemoveHandler = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      // when user chooses OK, call the props fn
      deleteBlog(blog.id)
    }
  }

  if (!showBlog) {
    return (
      <div>
        {blog.title} <button onClick={() => setShowBlog(true)}>View</button>
      </div>
    )
  }
  else {
    return (
      <ul className="blogStyle">
        <li>{blog.title} {blog.author} <button onClick={() => setShowBlog(false)}>Hide</button></li>
        <li>{blog.url}</li>
        <li>likes {blog.likes} <button onClick={() => updateBlog(blog)}>Like</button></li>
        <li>{blog.user.name}</li>
        {blog.user.username === user.username ?
          (<li> <button onClick={() => onRemoveHandler(blog)}>Remove</button></li>)
          : null }
      </ul>
    )
  }

}

export default Blog