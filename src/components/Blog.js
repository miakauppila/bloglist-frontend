import React from 'react'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlogAction, removeBlogAction } from '../reducers/blogReducer'
import { notificationAction } from '../reducers/notificationReducer'
import { useParams, useHistory } from 'react-router-dom'
import Notification from './Notification'
import { Table, Button } from 'react-bootstrap'


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
    catch (error) {
      console.log('Update blog error:', error)
      dispatch(notificationAction('Sorry, adding likes failed.', 'danger'))
    }
  }

  const removeHandler = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      // when user chooses OK
      try {
        await blogService.remove(blog.id)
        dispatch(removeBlogAction(blog.id))
        dispatch(notificationAction('Blog was removed', 'success'))
        history.push('/')
      }
      catch (error) {
        console.log('Delete blog error:', error)
        dispatch(notificationAction('Sorry, remove failed.', 'danger'))
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
      <h2>{blog.title} by {blog.author}</h2>
      <Notification />
      <Table className="blog-table">
        <tbody>
          <tr>
            <th>Title:</th>
            <td>{blog.title}</td>
            <td></td>
          </tr>
          <tr>
            <th>Author:</th>
            <td>{blog.author}</td>
            <td></td>
          </tr>
          <tr>
            <th>Url:</th>
            <td><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></td>
            <td></td>
          </tr>
          <tr>
            <th>Likes:</th>
            <td>{blog.likes}</td>
            <td><Button variant="outline-success" id="like-button" onClick={() => updateBlog(blog)}><i className="bi bi-heart-fill"></i> Like</Button></td>
          </tr>
          <tr>
            <th>Added by:</th>
            <td>
              {blog.user.name}
            </td>
            <td>{blog.user.username === user.username ?
              (<Button variant="outline-primary" id="remove-button" onClick={() => removeHandler(blog)}><i className="bi bi-file-excel-fill"></i> Remove</Button>)
              : null}</td>
          </tr>
        </tbody>

      </Table>
      <Button id="back-button" variant="secondary" onClick={backHandler}>Back</Button>
    </div>
  )
}

export default Blog