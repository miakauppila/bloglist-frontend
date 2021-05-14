import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { createBlogAction } from '../reducers/blogReducer'
import { notificationAction } from '../reducers/notificationReducer'
import { Form, Row, Button, Col } from 'react-bootstrap'

const NewBlogForm = (props) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.id]: event.target.value })
  }

  const dispatch = useDispatch()

  const handleCreateNew = async (event) => {
    console.log('handleSubmit')
    event.preventDefault()
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
    try {
      const createdBlog = await blogService.create(newBlog)
      console.log('blog created:', createdBlog)
      dispatch(createBlogAction(createdBlog))
      // access Togglable function via ref
      props.togglableRef.current.toggleVisibility()
      dispatch(notificationAction(`A new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success'))
    }
    catch (error) {
      console.log('Create new blog error:', error)
      dispatch(notificationAction('Sorry, adding the blog failed.', 'danger'))
    }
  }

  return (
    <div>
      <h3>Create new</h3>
      <div className="createBlogForm">
        <Form onSubmit={handleCreateNew}>
          <Form.Group as={Row} controlId="title">
            <Form.Label column sm="2">title:</Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                value={newBlog.title}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="author">
            <Form.Label column sm="2">author:</Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                value={newBlog.author}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="url">
            <Form.Label column sm="2">url:</Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                value={newBlog.url}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
          <Button className="float-left" type="submit" id="create-button">
           Create
          </Button>
        </Form>

      </div>

    </div>
  )}

export default NewBlogForm