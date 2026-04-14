import { useProducts } from '../context/ProductContext.jsx'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NgoPickups() {
  const { pickups } = useProducts()
  const navigate = useNavigate()

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/ngo')} style={{marginBottom: 8}}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="page-title">Pickup History</h1>
          <p className="page-subtitle">All your accepted donation pickups.</p>
        </div>
        <span className="card__header-count">{pickups.length} total</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table" id="ngo-pickups-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Vendor</th>
                <th>Quantity</th>
                <th>Accepted Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map((p) => (
                <tr key={p.id}>
                  <td className="cell-bold">{p.productName}</td>
                  <td>{p.vendorName || p.vendor}</td>
                  <td>{p.qty} {p.unit || 'kg'}</td>
                  <td>{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}</td>
                  <td><span className="condition-badge condition-fresh">{p.status}</span></td>
                </tr>
              ))}
              {pickups.length === 0 && (
                <tr><td colSpan="5" className="table-empty">No pickups yet. Accept donations to get started!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
