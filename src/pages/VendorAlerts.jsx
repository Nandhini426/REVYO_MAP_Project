import { useProducts } from '../context/ProductContext.jsx'
import { conditionMeta, isNearingExpiry, isExpired } from '../utils/helpers.js'
import { AlertTriangle, ArrowLeft, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function VendorAlerts() {
  const { expiryAlerts, products } = useProducts()
  const navigate = useNavigate()

  const nearExpiry = products.filter(p => isNearingExpiry(p.expiry) && !isExpired(p.expiry))
  const expired = products.filter(p => isExpired(p.expiry))

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/vendor')} style={{marginBottom: 8}}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="page-title">Expiry Alerts</h1>
          <p className="page-subtitle">Track products nearing or past their expiry date.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-row">
        <div className="stat-tile" style={{ '--stat-color': '#f59e0b' }}>
          <div className="stat-tile__icon"><Clock size={22} /></div>
          <div className="stat-tile__info">
            <span className="stat-tile__value">{nearExpiry.length}</span>
            <span className="stat-tile__label">Nearing Expiry (≤3 days)</span>
          </div>
        </div>
        <div className="stat-tile" style={{ '--stat-color': '#ef4444' }}>
          <div className="stat-tile__icon"><XCircle size={22} /></div>
          <div className="stat-tile__info">
            <span className="stat-tile__value">{expired.length}</span>
            <span className="stat-tile__label">Already Expired</span>
          </div>
        </div>
      </div>

      {/* Expired items */}
      {expired.length > 0 && (
        <div className="card card--warning">
          <div className="card__header">
            <h2><XCircle size={20} /> Expired Products</h2>
            <span className="card__header-count">{expired.length} items</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Expiry Date</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                {expired.map(p => {
                  const meta = conditionMeta(p.condition)
                  return (
                    <tr key={p.id} className="row--danger">
                      <td>
                        <div className="cell-product">
                          <span className="cell-product__emoji">{p.image || '🥦'}</span>
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category || '—'}</td>
                      <td>{p.qty} {p.unit}</td>
                      <td>{p.expiry} ❌</td>
                      <td><span className={`condition-badge ${meta.cssClass}`}>{meta.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nearing expiry */}
      {nearExpiry.length > 0 && (
        <div className="card">
          <div className="card__header">
            <h2><Clock size={20} /> Nearing Expiry</h2>
            <span className="card__header-count">{nearExpiry.length} items</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Expiry Date</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                {nearExpiry.map(p => {
                  const meta = conditionMeta(p.condition)
                  return (
                    <tr key={p.id} className="row--warning">
                      <td>
                        <div className="cell-product">
                          <span className="cell-product__emoji">{p.image || '🥦'}</span>
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category || '—'}</td>
                      <td>{p.qty} {p.unit}</td>
                      <td>{p.expiry} ⚠️</td>
                      <td><span className={`condition-badge ${meta.cssClass}`}>{meta.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {expired.length === 0 && nearExpiry.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <span className="empty-state__icon">✅</span>
            <p>No expiry alerts! All products are within safe date range.</p>
          </div>
        </div>
      )}
    </div>
  )
}
