import React from 'react'
import { useSelector } from 'react-redux'
import { Table, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const Users = () => {

  // Redux store: users
  const users = useSelector(state => state.users)

  const history = useHistory()
  const backHandler = () => {
    history.push('/')
  }

  return (
    <div className="users mb-4">
      <h2>Users</h2>
      <Table striped className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td id="user-name"> {user.name} </td>
              <td id="user-blogs">{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Button id="back-button" variant="secondary" onClick={backHandler}>Back</Button>
    </div>
  )
}

export default Users