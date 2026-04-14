import { useProducts } from '../context/ProductContext.jsx'
import { ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CustomerOrders() {
  const { orders } = useProducts()
  const navigate = useNavigate()

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/customer')} style={{marginBottom: 8}}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="page-title">Order History & Tracking</h1>
          <p className="page-subtitle">Track the status of your past and current purchases.</p>
        </div>
        <span className="card__header-count">{orders.length} total</span>
      </div>

      <div className="card">
        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p>You haven't placed any orders yet.</p>
            <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate('/customer/marketplace')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id || o.id}>
                    <td className="cell-bold">#{String(o._id || o.id).slice(-6).toUpperCase()}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{o.total}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {o.status === 'Delivered' ? <CheckCircle size={16} color="#10b981" /> : <Clock size={16} color="#f59e0b" />}
                        <span className={`status-pill status-${o.status?.toLowerCase()}`}>{o.status}</span>
                      </div>
                    </td>
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
                        Invoice
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
