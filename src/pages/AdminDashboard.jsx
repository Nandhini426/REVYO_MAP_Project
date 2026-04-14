import { useAuth } from '../context/AuthContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import ImpactTracker from '../components/ImpactTracker.jsx'
import { Users, Store, ShoppingBag, Heart, BarChart3, AlertTriangle, Shield } from 'lucide-react'
import { authAPI } from '../services/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { products, expiryAlerts, orders, pickups } = useProducts()
  const [users, setUsers] = useState([])
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await authAPI.getUsers()
      setUsers(data?.users || data || [])
    } catch (err) {
      console.error("Failed to fetch users", err)
      setUsers([])
    }
  }

  fetchUsers()
}, [])

  const stats = [
  { icon: Users, value: users.length, label: 'Total Users', color: '#8b5cf6' },
  { icon: Store, value: users.filter(u => u.role === 'vendor' || u.role === 'Vendor').length, label: 'Vendors', color: '#10b981' },
  { icon: ShoppingBag, value: users.filter(u => u.role === 'customer' || u.role === 'Customer').length, label: 'Customers', color: '#06b6d4' },
  { icon: Heart, value: users.filter(u => u.role === 'ngo' || u.role === 'NGO').length, label: 'NGOs', color: '#f59e0b' },
]

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome, <strong>{user.username}</strong>! System overview and control centre.</p>
        </div>
      </div>

      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.label} className="stat-tile" style={{ '--stat-color': s.color }}>
            <div className="stat-tile__icon"><s.icon size={22} /></div>
            <div className="stat-tile__info">
              <span className="stat-tile__value">{s.value}</span>
              <span className="stat-tile__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <ImpactTracker compact />

      {/* Alerts summary */}
      {expiryAlerts.length > 0 && (
        <div className="card card--warning" style={{marginBottom: 24}}>
          <div className="card__header">
            <h2><AlertTriangle size={20} /> System Alerts</h2>
            <span className="card__header-count">{expiryAlerts.length} expiry alerts</span>
          </div>
          <div className="alert-list">
            {expiryAlerts.slice(0, 3).map((p) => (
              <div key={p.id} className="alert-item">
                <span className="alert-item__icon">{p.image || '🥦'}</span>
                <span className="alert-item__name">{p.name}</span>
                <span className="alert-item__vendor">{p.vendor}</span>
                <span className="alert-item__expiry">Expires: {p.expiry}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-links" style={{marginBottom: 24}}>
        <div className="quick-link-card" onClick={() => navigate('/admin/users')}>
          <Shield size={28} />
          <div>
            <h3>User Management</h3>
            <p>View and manage all registered users across roles</p>
          </div>
          <span className="quick-link-card__count">{users.length} users</span>
        </div>
        <div className="quick-link-card" onClick={() => navigate('/admin/analytics')}>
          <BarChart3 size={28} />
          <div>
            <h3>Analytics & Insights</h3>
            <p>Charts, trends, and environmental impact data</p>
          </div>
        </div>
      </div>

      {/* Invoice Tracker */}
      <div className="card">
        <div className="card__header">
          <h2>All Invoices & Orders</h2>
          <span className="card__header-count">{orders?.length || 0} total</span>
        </div>
        {!orders || orders.length === 0 ? (
          <div className="empty-state">No orders in the system yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id || o.id}>
                    <td>#{String(o._id || o.id).slice(-6).toUpperCase()}</td>
                    <td>{o.customerName || 'N/A'}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>₹{o.total}</td>
                    <td><span className={`status-pill status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    <td>
                      <button 
                        className="btn btn--ghost btn--sm" 
                        onClick={async () => {
                          try {
                            const { orderAPI } = await import('../services/api');
                            const blob = await orderAPI.downloadInvoice(o._id || o.id);
                            const url = window.URL.createObjectURL(new Blob([blob]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `invoice-${o._id || o.id}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                            link.parentNode.removeChild(link);
                          } catch (err) {
                            alert('Failed to download invoice');
                          }
                        }}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Donation Tracker */}
      <div className="card" style={{marginTop: 24}}>
        <div className="card__header">
          <h2>All NGO Donation Pickups</h2>
          <span className="card__header-count">{pickups?.length || 0} total</span>
        </div>
        {!pickups || pickups.length === 0 ? (
          <div className="empty-state">No donations claimed by NGOs yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Accepted Date</th>
                </tr>
              </thead>
              <tbody>
                {pickups.map(p => (
                  <tr key={p._id || p.id}>
                    <td className="cell-bold">{p.productName}</td>
                    <td>{p.vendorName || p.vendor}</td>
                    <td>{p.qty} {p.unit || 'kg'}</td>
                    <td><span className="status-pill status-delivered">{p.status}</span></td>
                    <td>{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
