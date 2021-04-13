import React, { useState } from 'react'

const NewBlogForm = ({ createNewBlog }) => {

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    console.log('handleSubmit')
    event.preventDefault()
    // send blog object to createNewBlog props function
    createNewBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>Create new</h2>
      <div className="createBlogForm">
        <form onSubmit={handleSubmit}>
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