import React from 'react'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlogAction, removeBlogAction, commentBlogAction } from '../reducers/blogReducer'
import { notificationAction } from '../reducers/notificationReducer'
import { useParams, useHistory } from 'react-router-dom'
import Notification from './Notification'
import { Table, Button, Form, Row, Col } from 'react-bootstrap'


const Blog = () => {

  // Redux store: user saved after login success
  const user = useSelector(state => state.loggedUser)
  // Redux store: blogs
  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()

  const blogId = useParams().id
  const blog = blogs.find(blog => blog.id === blogId)
  //console.log('Render blog', blog)

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

  const commentHandler = async (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    // reset form's content
    event.target.reset()
    // convert into obj for axios post
    const commentObj = { content: comment }
    try {
      const commentedBlog = await blogService.addComment(blogId, commentObj)
      console.log(commentedBlog)
      dispatch(commentBlogAction(commentedBlog))
      dispatch(notificationAction('Comment added', 'success'))
    }
    catch (error) {
      console.log('Comment blog error:', error)
      dispatch(notificationAction('Sorry, adding comments failed.', 'danger'))
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
    <div className="blog mb-4">
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
      <h3>Comments</h3>
      <Form id="comment-form" onSubmit={commentHandler}>
        <Form.Group as={Row} controlId="comment">
          <Col md="9" className="mb-2">
            <Form.Label srOnly={true}>Comment</Form.Label>
            <Form.Control type="text"
              name="comment"
              placeholder="Leave your comment"
              required />
          </Col>
          <Col md="auto">
            <Button variant="outline-primary"
              type="submit"
              id="comment-button">
              <i className="bi bi-chat-square-text-fill"></i>
            Add comment
            </Button>
          </Col>
        </Form.Group>
      </Form>
      {blog.comments.map((comment) =>
        <li key={comment.id}>{comment.content}</li>
      )}
      <div className="mt-3">
        <Button id="back-button" variant="secondary" onClick={backHandler}>Back</Button>
      </div>
    </div>
  )
}

export default Blog