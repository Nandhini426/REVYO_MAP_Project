import { useProducts } from '../context/ProductContext.jsx'
import { ArrowLeft, Clock, CheckCircle, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminTransactions() {
  const { orders, pickups } = useProducts()
  const navigate = useNavigate()

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/admin')} style={{marginBottom: 8}}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="page-title">Activity Tracker</h1>
          <p className="page-subtitle">Dedicated page for monitoring all Orders and NGO Pickups across the platform.</p>
        </div>
      </div>

      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-tile" style={{ '--stat-color': '#06b6d4' }}>
          <div className="stat-tile__icon"><Package size={22} /></div>
          <div className="stat-tile__info">
            <span className="stat-tile__value">{orders?.length || 0}</span>
            <span className="stat-tile__label">Total Orders</span>
          </div>
        </div>
        <div className="stat-tile" style={{ '--stat-color': '#10b981' }}>
          <div className="stat-tile__icon"><CheckCircle size={22} /></div>
          <div className="stat-tile__info">
            <span className="stat-tile__value">{pickups?.length || 0}</span>
            <span className="stat-tile__label">Completed Pickups</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Orders Column */}
        <div className="card">
          <div className="card__header">
            <h2>Customer Orders</h2>
          </div>
          {!orders || orders.length === 0 ? (
            <div className="empty-state">No orders yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id || o.id}>
                      <td className="cell-bold">{String(o._id || o.id).slice(-6).toUpperCase()}</td>
                      <td>{o.customerName || 'N/A'}</td>
                      <td>₹{o.total}</td>
                      <td><span className={`status-pill status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Donations Column */}
        <div className="card">
          <div className="card__header">
            <h2>NGO Pickups</h2>
          </div>
          {!pickups || pickups.length === 0 ? (
            <div className="empty-state">No donations claimed by NGOs yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Vendor</th>
                    <th>NGO</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {pickups.map(p => (
                    <tr key={p._id || p.id}>
                      <td className="cell-bold">{p.productName}</td>
                      <td>{p.vendorName || p.vendor}</td>
                      <td>{p.ngoName || p.ngo || 'Unknown'}</td>
                      <td>{p.qty} {p.unit || 'kg'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
