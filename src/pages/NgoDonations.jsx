import { useProducts } from '../context/ProductContext.jsx'
import { Package, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function NgoDonations() {
  const { pickups, acceptPickup, refreshData } = useProducts()
  const navigate = useNavigate()

  // Load donations when page opens
  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div className="page-content">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => navigate('/ngo')}
            style={{ marginBottom: 8 }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <h1 className="page-title">Available Donations</h1>
          <p className="page-subtitle">
            Surplus food from vendors ready for collection.
          </p>
        </div>

        <span className="card__header-count">
          {pickups?.length || 0} items available
        </span>
      </div>

      {/* CONTENT */}
      {pickups && pickups.length > 0 ? (
        <div className="donation-grid" style={{ padding: 0 }}>

          {pickups.map((d) => (
            <div
              key={d._id || d.id}
              className="donation-card"
              id={`donation-${d._id || d.id}`}
            >

              {/* IMAGE / ICON */}
              <div className="donation-card__emoji">
                {d.image || '🥦'}
              </div>

              {/* DETAILS */}
              <div className="donation-card__body">

                <h3>{d.productName}</h3>

                <p className="donation-card__meta">
                  <span>📦 {d.qty} {d.unit}</span>
                </p>

                <p className="donation-card__meta">
                  <span>🏪 {d.vendorName}</span>
                </p>

                <p className="donation-card__category">
                  {d.status === 'claimed' ? '✅ Claimed' : '🟡 Available'}
                </p>

              </div>

              {/* ACTION BUTTON */}
              <button
                className="btn btn--primary btn--sm"
                disabled={d.status === 'claimed'}
                onClick={() => acceptPickup(d)}
              >
                {d.status === 'claimed'
                  ? 'Already Claimed'
                  : 'Accept Donation'}
              </button>

            </div>
          ))}

        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <span className="empty-state__icon">🎉</span>
            <p>No surplus items available right now. Check back later!</p>
          </div>
        </div>
      )}
    </div>
  )
}