import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authAPI } from '../services/api'

export default function AdminUsers() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authAPI.getUsers()
        setUsers(Array.isArray(data) ? data : data.users || [])
      } catch (err) {
        console.error(err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => navigate('/admin')}
            style={{ marginBottom: 8 }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">
            View and manage all registered users.
          </p>
        </div>

        <span className="card__header-count">
          {users.length} total users
        </span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table" id="admin-users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td className="cell-bold">
                      {u.name || u.username}
                    </td>

                    <td className="cell-muted">{u.email}</td>

                    <td>
                      <span
                        className={`role-tag role-tag--${(
                          u.role || ''
                        ).toLowerCase()}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : '-'}
                    </td>

                    <td>
                      <span
                        className={`condition-badge ${
                          u.status === 'Active'
                            ? 'condition-fresh'
                            : 'condition-spoiled'
                        }`}
                      >
                        {u.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}