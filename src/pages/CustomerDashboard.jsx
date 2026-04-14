import { useAuth } from '../context/AuthContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { ShoppingBag, DollarSign, Leaf, ShoppingCart, Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { cart, orders } = useProducts()
  const navigate = useNavigate()

  const totalSpent = orders.reduce((s, o) => s + o.total, 0)
  const stats = [
    { icon: ShoppingBag, value: orders.length, label: 'Orders Placed', color: '#06b6d4' },
    { icon: DollarSign, value: `₹${totalSpent.toFixed(0)}`, label: 'Total Spent', color: '#10b981' },
    { icon: Leaf, value: `${(orders.length * 2.1).toFixed(1)} kg`, label: 'Waste Prevented', color: '#8b5cf6' },
  ]

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Dashboard</h1>
          <p className="page-subtitle">Welcome, <strong>{user.username}</strong>! Browse fresh and discounted produce.</p>
        </div>
        <div className="page-header__badge" onClick={() => navigate('/customer/cart')} style={{cursor:'pointer'}}>
          <ShoppingCart size={18} />
          <span>{cart.length} items</span>
        </div>
      </div>

      {/* Stats */}
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

      {/* Quick links */}
      <div className="quick-links">
        <div className="quick-link-card" onClick={() => navigate('/customer/marketplace')}>
          <Store size={28} />
          <div>
            <h3>Browse Marketplace</h3>
            <p>Explore fresh and discounted produce from local vendors</p>
          </div>
        </div>
        <div className="quick-link-card" onClick={() => navigate('/customer/cart')}>
          <ShoppingCart size={28} />
          <div>
            <h3>My Cart</h3>
            <p>Review items and place your order</p>
          </div>
          <span className="quick-link-card__count">{cart.length} items</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card__header">
          <h2>Order History</h2>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">You have no orders.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id || o.id}>
                    <td>#{String(o._id || o.id).slice(-6).toUpperCase()}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td><span className={`status-pill status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    <td>₹{o.total}</td>
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
    </div>
  )
}
