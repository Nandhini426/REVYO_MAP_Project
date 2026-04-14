import { useAuth } from '../context/AuthContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import ImpactTracker from '../components/ImpactTracker.jsx'
import { Package, AlertTriangle, Trash2, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function VendorDashboard() {
  const { user } = useAuth()
  const { products, expiryAlerts } = useProducts()
  const navigate = useNavigate()

  const freshCount = products.filter(p => p.condition === 'fresh').length
  const semiCount = products.filter(p => p.condition === 'semi').length
  const spoiledCount = products.filter(p => p.condition === 'spoiled').length

  const stats = [
    { icon: Package, value: products.length, label: 'Total Products', color: '#10b981' },
    { icon: AlertTriangle, value: expiryAlerts.length, label: 'Expiry Alerts', color: '#f59e0b' },
    { icon: Trash2, value: spoiledCount, label: 'Spoiled Items', color: '#ef4444' },
    { icon: Heart, value: spoiledCount, label: 'Pending Donations', color: '#8b5cf6' },
  ]

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vendor Dashboard</h1>
          <p className="page-subtitle">Welcome back, <strong>{user.username}</strong>. Overview of your produce inventory.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.label} className="stat-tile stat-tile--clickable" style={{ '--stat-color': s.color }}
            onClick={() => {
              if (s.label === 'Expiry Alerts') navigate('/vendor/alerts')
              else navigate('/vendor/inventory')
            }}>
            <div className="stat-tile__icon"><s.icon size={22} /></div>
            <div className="stat-tile__info">
              <span className="stat-tile__value">{s.value}</span>
              <span className="stat-tile__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Impact strip */}
      <ImpactTracker compact />

      {/* Quick summary cards */}
      <div className="quick-links">
        <div className="quick-link-card" onClick={() => navigate('/vendor/inventory')}>
          <Package size={28} />
          <div>
            <h3>Manage Inventory</h3>
            <p>Add, edit, or remove products from your stock</p>
          </div>
          <span className="quick-link-card__count">{freshCount} fresh, {semiCount} semi</span>
        </div>
        <div className="quick-link-card" onClick={() => navigate('/vendor/alerts')}>
          <AlertTriangle size={28} />
          <div>
            <h3>Expiry Alerts</h3>
            <p>Products nearing or past expiry date</p>
          </div>
          <span className="quick-link-card__count quick-link-card__count--warn">{expiryAlerts.length} alerts</span>
        </div>
      </div>
    </div>
  )
}
