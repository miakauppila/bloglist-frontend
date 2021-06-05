import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { MemoryRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createBlogAction } from '../reducers/blogReducer'
import store from '../store'
import { setLoggedUserAction } from '../reducers/loggedReducer'
import blogService from '../services/blogs'

const testBlog = {
  author: 'Writer',
  comments: [{ content: 'Testikommentti 1', id: '1' }, { content: 'Testikommentti 2', id: '2' }],
  id: '606d73eb83a536049c715284',
  likes: 0,
  title: 'Test blog',
  url: 'www.test.com',
  user: {
    id: '603a295c51e3c2a93826367d',
    name: 'Test User',
    username: 'testuser'
  }
}

const testUser = {
  name: 'Test User',
  username: 'testuser'
}

const testUser2 = {
  name: 'Second User',
  username: 'seconduser'
}

describe('<Blog /> rendering', () => {
  let component

  beforeEach(() => {

    component = render(<Provider store={store}>
      <MemoryRouter initialEntries={['/blogs/606d73eb83a536049c715284']}>
        <Route path="/blogs/:id" component={Blog} />
      </MemoryRouter></Provider>
    )

    store.dispatch(setLoggedUserAction(testUser))
    store.dispatch(createBlogAction(testBlog))
  })

  test('renders blog content', () => {
    // print HTML to console when needed
    //component.debug()

    const blogDiv = component.container.querySelector('.blog')
    expect(blogDiv).toHaveTextContent(testBlog.title)
    expect(blogDiv).toHaveTextContent(testBlog.author)
    expect(blogDiv).toHaveTextContent(testBlog.url)
    expect(blogDiv).toHaveTextContent(testBlog.likes)
    expect(blogDiv).toHaveTextContent(testBlog.user.name)
    expect(blogDiv).toHaveTextContent(testBlog.comments[0].content)
    expect(blogDiv).toHaveTextContent(testBlog.comments[1].content)
  })

  test('renders Like, Remove, Add Comment and Back buttons', () => {
    const likeBtn = component.getByText('Like', { selector: 'button' })
    expect(likeBtn).toBeDefined()
    const deleteBtn = component.getByText('Remove', { selector: 'button' })
    expect(deleteBtn).toBeDefined()
    const addCommentBtn = component.getByText('Add comment', { selector: 'button' })
    expect(addCommentBtn).toBeDefined()
    const backBtn = component.getByText('Back', { selector: 'button' })
    expect(backBtn).toBeDefined()
  })

  test('no delete button available when logged user is not blog creator', () => {
    store.dispatch(setLoggedUserAction(testUser2))
    expect(component.container).not.toHaveTextContent('Delete')
  })

})

describe('<Blog /> interactions', () => {
  let component

  beforeEach(() => {
    jest.restoreAllMocks()

    component = render(<Provider store={store}>
      <MemoryRouter initialEntries={['/blogs/606d73eb83a536049c715284']}>
        <Route path="/blogs/:id" component={Blog} />
      </MemoryRouter></Provider>
    )
    // testuser log in & create testblog into Redux store
    store.dispatch(setLoggedUserAction(testUser))
    store.dispatch(createBlogAction(testBlog))
  })

  test('clicking the Like button twice calls the event handler two times', () => {
    const likeBtn = component.getByText('Like', { selector: 'button' })

    // mock fn that is called by clicking the Like button
    const mockHandler = jest.fn()
    likeBtn.onclick = mockHandler
    // press the button two times
    fireEvent.click(likeBtn)
    fireEvent.click(likeBtn)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('Axios update spy should be called when clicking the Like button', async () => {

    const axiosSpy = jest.spyOn(blogService, 'update').mockReturnValue({})

    const likeBtn = component.getByText('Like', { selector: 'button' })
    // click the Like button
    fireEvent.click(likeBtn)

    expect(axiosSpy).toHaveBeenCalledTimes(1)
    // spy should be called with blog id & blogObj with increased likes
    expect(axiosSpy.mock.calls[0][0]).toBe(testBlog.id)
    expect(axiosSpy.mock.calls[0][1].likes).toBe(testBlog.likes + 1)
  })

  test('Axios remove spy should be called when clicking the Remove button', () => {

    const axiosSpy = jest.spyOn(blogService, 'remove').mockReturnValue({})
    window.confirm = jest.fn().mockReturnValue(true)

    const deleteBtn = component.getByText('Remove', { selector: 'button' })
    // click the Remove button
    fireEvent.click(deleteBtn)

    // spy should be called with blog id
    expect(axiosSpy).toHaveBeenCalledTimes(1)
    expect(axiosSpy).toHaveBeenCalledWith(testBlog.id)
  })

  test('Axios addComment spy should be called when Add comment button is clicked', () => {

    const axiosSpy = jest.spyOn(blogService, 'addComment').mockReturnValue({})

    // fire change event of input
    const input = component.container.querySelector('#comment')
    fireEvent.change(input, { target: { value: 'New comment' } })
    expect(input.value).toBe('New comment')

    const commentBtn = component.getByText('Add comment', { selector: 'button' })
    // click the Add comment button
    fireEvent.click(commentBtn)

    // spy should be called with blog id & commentObj
    expect(axiosSpy).toHaveBeenCalledTimes(1)
    expect(axiosSpy.mock.calls[0][0]).toBe(testBlog.id)
    expect(axiosSpy.mock.calls[0][1]).toEqual({ content: 'New comment' })
  })

})