import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {

  test('Props function should be called with values of form input fields when pressing the Create button', () => {

    // mock fn that is called by pressing the Create button
    const mockHandler = jest.fn()

    const component = render(
      <NewBlogForm createNewBlog={mockHandler} />
    )

    // fire change events to update the values of the input fields
    const title = component.container.querySelector('#title')
    fireEvent.change(title, { target: { value: 'Blogtest' } })

    const author = component.container.querySelector('#author')
    fireEvent.change(author, { target: { value: 'Writer' } })

    const url = component.container.querySelector('#url')
    fireEvent.change(url, { target: { value: 'www.blog.com' } })

    // use PrettyDom to print HTML to console => values should be filled now
    const div = component.container.querySelector('.createBlogForm')
    console.log(prettyDOM(div))

    //fire event to submit the form with Create button
    const submitButton = component.getByText('Create')
    fireEvent.click(submitButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    // mockHandler fn should be called with new blog object (3 input values)
    expect(mockHandler).toHaveBeenCalledWith({ 'author': 'Writer', 'title': 'Blogtest', 'url': 'www.blog.com' })

  })

})