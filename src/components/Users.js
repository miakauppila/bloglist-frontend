import React from 'react'
import { useSelector } from 'react-redux'

const Users = () => {

  // Redux store: users
  const users = useSelector(state => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td> {user.name} </td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users