import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog /> rendering', () => {
  let component

  const testBlog = {
    author: 'Writer',
    id: '606d73eb83a536049c715284',
    likes: 0,
    title: 'Test blog',
    url: 'www.test.com',
    user: {
      id: '603a295c51e3c2a93826367d',
      name: 'Matti Luukkainen',
      username: 'mluukkai'
    }
  }

  const testUser = {
    name: 'Matti Luukkainen',
    username: 'mluukkai'
  }

  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} user={testUser} />
    )
  })

  test('renders by default author and title but not url and likes', () => {

    // print HTML to console when needed
    //component.debug()

    const visibleDiv = component.container.querySelector('.blog-header')
    expect(visibleDiv).not.toHaveStyle('display: none')

    expect(visibleDiv).toHaveTextContent('Test blog Writer')
    expect(visibleDiv).not.toHaveTextContent('www.test.com')
    expect(visibleDiv).not.toHaveTextContent('likes 0')

    const hidden = component.container.querySelector('.blog-details')
    expect(hidden).toHaveStyle('display: none')
  })

  test('renders also url and likes after pressing the View button', () => {

    // find & press the View button
    const button = component.getByText('View')
    fireEvent.click(button)

    // use PrettyDom to print HTML to console
    //const blogUl = component.container.querySelector('ul')
    //console.log(prettyDOM(blogUl))

    // should not be hidden after pressing View
    const ul = component.container.querySelector('.blog-details')
    expect(ul).not.toHaveStyle('display: none')

    expect(ul).toHaveTextContent('www.test.com')
    expect(ul).toHaveTextContent('likes 0')
  })

})

describe('<Blog /> interactions', () => {
  let component

  const testBlog = {
    author: 'Kirjoittaja',
    id: '606d73eb83a536049c715284',
    likes: 0,
    title: 'Testiblogi',
    url: 'www.testi.com',
    user: {
      id: '603a295c51e3c2a93826367d',
      name: 'Matti Luukkainen',
      username: 'mluukkai'
    }
  }

  const testUser = {
    name: 'Matti Luukkainen',
    username: 'mluukkai'
  }

  test('clicking the Like button twice calls the event handler two times', async () => {

    // mock fn that is called by pressing the Like button
    const mockHandler = jest.fn()

    component = render(
      <Blog blog={testBlog} user={testUser} updateBlog={mockHandler}/>
    )

    // press to see blog details
    const viewButton = component.getByText('View')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('Like')
    // press the button two times
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})