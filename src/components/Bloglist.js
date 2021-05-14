import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Notification from './Notification'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'
import { Table } from 'react-bootstrap'

const Bloglist = () => {

  // Redux store: blogs
  const blogs = useSelector(state => state.blogs)

  // used for linking with Togglable
  const newBlogFormRef = useRef()

  // sort blogs by amount of likes
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <Togglable buttonLabel='Add new' ref={newBlogFormRef}>
        {/* NewBlogForm becomes the children of Togglable (show/hide) */}
        <NewBlogForm togglableRef={newBlogFormRef} />
      </Togglable>

      <Table striped className="blog-table">
        <tbody>
          {sortedBlogs.map(blog =>
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>
                {blog.author}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Bloglist