import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsersAction } from '../reducers/userReducer'

const Users = () => {
  const dispatch = useDispatch()

  // Redux store: users
  const users = useSelector(state => state.users)

  // runs once to initialize users
  useEffect(() => {
    dispatch(initializeUsersAction())
  }, [dispatch])

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