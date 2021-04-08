import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog /> rendering', () => {
  let component

  const testBlog = {
    author: 'Writer',
    id: '606d73eb83a536049c715284',
    likes: 0,
    title: 'One blog',
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

    expect(component.container).toHaveTextContent(
      'One blog Writer'
    )

    expect(component.container).not.toHaveTextContent(
      'www.test.com'
    )

    expect(component.container).not.toHaveTextContent(
      'likes'
    )
  })

  test('renders also url and likes after pressing the View button', () => {

    const button = component.getByText('View')
    fireEvent.click(button)

    // use PrettyDom to print HTML to console
    // const ul = component.container.querySelector('ul')
    // console.log(prettyDOM(ul))

    const url = component.getByText('www.test.com')
    expect(url).toBeDefined()
    const likes = component.getByText('likes 0')
    expect(likes).toBeDefined()
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