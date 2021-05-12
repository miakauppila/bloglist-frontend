import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { createBlogAction } from '../reducers/blogReducer'
import { notificationAction } from '../reducers/notificationReducer'

const NewBlogForm = (props) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value })
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
      dispatch(notificationAction('Please fill in complete blog data', 'error'))
    }
  }

  return (
    <div>
      <h2>Create new</h2>
      <div className="createBlogForm">
        <form onSubmit={handleCreateNew}>
          <div>
                    title
            <input
              type="text"
              value={newBlog.title}
              id="title"
              name="title"
              onChange={handleChange}
            />
          </div>
          <div>
                    author
            <input
              type="text"
              value={newBlog.author}
              id="author"
              name="author"
              onChange={handleChange}
            />
          </div>
          <div>
                    url
            <input
              type="text"
              value={newBlog.url}
              id="url"
              name="url"
              onChange={handleChange}
            />
          </div>
          <button type="submit" id="create-button">Create</button>
        </form>

      </div>

    </div>
  )}

export default NewBlogForm