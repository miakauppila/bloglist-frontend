import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import NewBlogForm from './NewBlogForm'
import { Provider } from 'react-redux'
import blogService from '../services/blogs'
import store from '../store'

describe('<NewBlogForm />', () => {
  let component

  beforeEach(() => {

    component = render(<Provider store={store}>
      <NewBlogForm />
    </Provider>
    )
  })

  test('Form submit works', () => {

    const form = component.container.querySelector('form')

    // mock fn that must be called by submitting the form
    const createMockHandler = jest.fn()
    form.onsubmit = createMockHandler

    //fire event to submit the form
    fireEvent.submit(form)
    expect(createMockHandler.mock.calls).toHaveLength(1)
    createMockHandler.mockReset()
  })

  test('Axios create spy should be called with values of form inputs when form is submitted', () => {

    // fire change events of input fields (values go into state)
    const title = component.container.querySelector('#title')
    fireEvent.change(title, { target: { value: 'Blogtest' } })

    const author = component.container.querySelector('#author')
    fireEvent.change(author, { target: { value: 'Writer' } })

    const url = component.container.querySelector('#url')
    fireEvent.change(url, { target: { value: 'www.blog.com' } })

    // use PrettyDom to print HTML to console => values should be filled now
    //const div = component.container.querySelector('.createBlogForm')
    //console.info(prettyDOM(div))

    const axiosSpy = jest.spyOn(blogService, 'create').mockReturnValue({})
    const form = component.container.querySelector('form')

    //fire event to submit the form
    fireEvent.submit(form)

    expect(axiosSpy).toHaveBeenCalledTimes(1)
    // axiosSpy fn should be called with new blog object (3 input values coming from state)
    expect(axiosSpy).toHaveBeenCalledWith({ 'author': 'Writer', 'title': 'Blogtest', 'url': 'www.blog.com' })
  })

})