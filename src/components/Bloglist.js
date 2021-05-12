import React from 'react'
import { useSelector } from 'react-redux'
import Blog from '../components/Blog'

const Bloglist = () => {

  // Redux store: blogs
  const blogs = useSelector(state => state.blogs)

  // sort blogs by amount of likes
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div className="blog-list">
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
        />
      )}
    </div>
  )
}

export default Bloglist