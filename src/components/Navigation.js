import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeLoggedUserAction } from '../reducers/loggedReducer'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Button, Container } from 'react-bootstrap'

const Navigation = () => {
  const dispatch = useDispatch()

  // Redux store: user saved after login success
  const loggedUser = useSelector(state => state.loggedUser)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(removeLoggedUserAction())
  }

  const padding = {
    padding: 5
  }

  if (loggedUser === null) {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand><i className="bi bi-bookmark-star"></i> Great Blogs App</Navbar.Brand>
        </Container>
      </Navbar>
    )
  }

  return (
    <Navbar className="p-lg-4" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand><i className="bi bi-bookmark-star"></i> Great Blogs App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as="span">
              <Link style={padding} to="/">blogs</Link>
            </Nav.Link>
            <Nav.Link as="span">
              <Link style={padding} to="/users">users</Link>
            </Nav.Link>
          </Nav>
          <Navbar.Text className="mr-4">{loggedUser.name} logged in</Navbar.Text>
          <div className="d-sm-inline-flex">
            <Button className="btn-block" variant="light" onClick={handleLogout}>logout <i className="bi bi-box-arrow-right"></i></Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation


