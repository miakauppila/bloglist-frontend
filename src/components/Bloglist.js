import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Notification from './Notification'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'

const Bloglist = () => {

  // Redux store: blogs
  const blogs = useSelector(state => state.blogs)

  // used for linking with Togglable
  const blogFormRef = useRef()

  // sort blogs by amount of likes
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <Notification />
      <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
        {/* NewBlogForm becomes the children of Togglable (show/hide) */}
        <NewBlogForm togglableRef={blogFormRef} />
      </Togglable>
      <ul className="blog-list">
        {sortedBlogs.map(blog =>
          <li className="blog-link" key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Bloglist