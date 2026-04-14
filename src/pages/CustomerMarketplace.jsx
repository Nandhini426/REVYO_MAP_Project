import { useProducts } from '../context/ProductContext.jsx'
import { conditionMeta } from '../utils/helpers.js'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CustomerMarketplace() {
  const { customerProducts, addToCart } = useProducts()
  const navigate = useNavigate()

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/customer')} style={{marginBottom: 8}}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="page-title">Marketplace</h1>
          <p className="page-subtitle">Browse fresh and discounted produce from local vendors.</p>
        </div>
        <span className="card__header-count">{customerProducts.length} products available</span>
      </div>

      <div className="product-grid" style={{ padding: 0 }}>
        {customerProducts.map((p) => {
          const meta = conditionMeta(p.condition)
          const discountedPrice = p.condition === 'semi' && p.discount
            ? (p.price * (1 - p.discount / 100)).toFixed(0)
            : null
          return (
            <div key={p.id} className="product-tile" id={`product-${p.id}`}>
              {p.condition === 'semi' && (
                <div className="product-tile__discount-ribbon">−{p.discount || 30}%</div>
              )}
              <div className="product-tile__emoji">{p.image || '🥦'}</div>
              <div className="product-tile__body">
                <h3 className="product-tile__name">{p.name}</h3>
                <p className="product-tile__vendor">by {p.vendor}</p>
                <span className={`condition-badge condition-badge--sm ${meta.cssClass}`}>{meta.label}</span>
              </div>
              <div className="product-tile__footer">
                <div className="product-tile__price">
                  {discountedPrice ? (
                    <>
                      <span className="price-old">₹{p.price}</span>
                      <span className="price-new">₹{discountedPrice}</span>
                    </>
                  ) : (
                    <span className="price-new">₹{p.price}</span>
                  )}
                  <span className="price-unit">/{p.unit}</span>
                </div>
                <button className="btn btn--primary btn--sm" onClick={() => addToCart(p)}>
                  <ShoppingCart size={14} /> Add
                </button>
              </div>
            </div>
          )
        })}
        {customerProducts.length === 0 && (
          <div className="empty-state">No products available right now.</div>
        )}
      </div>
    </div>
  )
}
