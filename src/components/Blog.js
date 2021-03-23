import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const [showBlog, setShowBlog] = useState(false)

  if (!showBlog) {
    return (
      <div>
        {blog.title}
        <button onClick={() => setShowBlog(true)}>View</button>
      </div>
    )
  }
  else {
    return (
        <ul className="blogStyle">
        <li>{blog.title} <button onClick={() => setShowBlog(false)}>Hide</button></li>
        <li>{blog.url}</li>
        <li>likes {blog.likes} <button>Like</button></li>
        <li>{blog.author}</li>
        </ul>
    )
  }

}

export default Blog