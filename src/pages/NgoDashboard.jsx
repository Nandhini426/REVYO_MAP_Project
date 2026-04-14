import { useAuth } from '../context/AuthContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import ImpactTracker from '../components/ImpactTracker.jsx'
import { ClipboardList, CheckCircle2, Scale, Users, Package, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NgoDashboard() {
  const { user } = useAuth()
  const { ngoProducts, pickups } = useProducts()
  const navigate = useNavigate()

  const completedPickups = pickups.filter(p => p.status === 'Accepted').length
  const totalRescued = pickups.reduce((s, p) => s + (p.qty || 0), 0)

  const stats = [
    { icon: ClipboardList, value: pickups.length, label: 'Total Pickups', color: '#f59e0b' },
    { icon: CheckCircle2, value: completedPickups, label: 'Accepted', color: '#10b981' },
    { icon: Scale, value: `${totalRescued} kg`, label: 'Food Rescued', color: '#06b6d4' },
    { icon: Users, value: '150+', label: 'People Served', color: '#8b5cf6' },
  ]

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">NGO Dashboard</h1>
          <p className="page-subtitle">Welcome, <strong>{user.username}</strong>! Manage surplus food collections and donations.</p>
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

      <div className="quick-links">
        <div className="quick-link-card" onClick={() => navigate('/ngo/donations')}>
          <Heart size={28} />
          <div>
            <h3>Available Donations</h3>
            <p>Browse surplus food from vendors and accept donations</p>
          </div>
          <span className="quick-link-card__count">{ngoProducts.length} available</span>
        </div>
        <div className="quick-link-card" onClick={() => navigate('/ngo/pickups')}>
          <Package size={28} />
          <div>
            <h3>My Pickups</h3>
            <p>View your accepted donation pickup history</p>
          </div>
          <span className="quick-link-card__count">{pickups.length} pickups</span>
        </div>
      </div>
    </div>
  )
}
