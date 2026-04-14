import { useState } from 'react'
import { useProducts } from '../context/ProductContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { conditionMeta, isNearingExpiry, isExpired } from '../utils/helpers.js'
import { Plus, X, Trash2, ArrowLeft, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { donationAPI } from '../services/api.js'

export default function VendorInventory() {
  const { user } = useAuth()
  const { products, addProduct, removeProduct } = useProducts()
  const navigate = useNavigate()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', qty: '', price: '', unit: 'kg', condition: 'fresh', expiry: '', category: 'Vegetables', image: '🥦' })

  const freshCount = products.filter(p => p.condition === 'fresh').length
  const semiCount = products.filter(p => p.condition === 'semi').length
  const spoiledCount = products.filter(p => p.condition === 'spoiled').length

  const handleAdd = (e) => {
    e.preventDefault()
    addProduct({ ...form, qty: Number(form.qty), price: Number(form.price), vendor: user.username })
    setForm({ name: '', qty: '', price: '', unit: 'kg', condition: 'fresh', expiry: '', category: 'Vegetables', image: '🥦' })
    setShowAdd(false)
  }

  const handleDonate = async (product) => {
    try {
      await donationAPI.create({
        itemName: product.name,
        quantity: `${product.qty} ${product.unit}`,
        category: product.category || 'Vegetables',
        condition: product.condition,
        expiryDate: product.expiry,
      })
      alert('Product safely donated to NGO!')
      removeProduct(product.id) // Alternatively delete from backend
    } catch (err) {
      alert(err.message || 'Failed to donate product')
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/vendor')} style={{marginBottom: 8}}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">Add, edit, and manage your product listings.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowAdd(true)} id="add-product-btn">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Add product modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} id="add-product-modal">
            <div className="modal__header">
              <h3>Add New Product</h3>
              <button className="modal__close" onClick={() => setShowAdd(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="modal__form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input className="form-input" placeholder="e.g. Organic Tomatoes" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Leafy Greens</option>
                    <option>Exotic</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input className="form-input" type="number" placeholder="e.g. 50" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select className="form-input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                    <option value="kg">Kg</option>
                    <option value="units">Units</option>
                    <option value="bundles">Bundles</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input className="form-input" type="number" placeholder="e.g. 40" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <select className="form-input" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                    <option value="fresh">Fresh</option>
                    <option value="semi">Semi-Fresh</option>
                    <option value="spoiled">Spoiled</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input className="form-input" type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn--primary btn--full">Add Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Inventory table */}
      <div className="card">
        <div className="card__header">
          <h2>All Products</h2>
          <div className="card__header-pills">
            <span className="pill pill--green">{freshCount} Fresh</span>
            <span className="pill pill--amber">{semiCount} Semi</span>
            <span className="pill pill--red">{spoiledCount} Spoiled</span>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table" id="vendor-inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Expiry</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const meta = conditionMeta(p.condition)
                const nearExpiry = isNearingExpiry(p.expiry)
                const expired = isExpired(p.expiry)
                return (
                  <tr key={p.id} className={expired ? 'row--danger' : nearExpiry ? 'row--warning' : ''}>
                    <td>
                      <div className="cell-product">
                        <span className="cell-product__emoji">{p.image || '🥦'}</span>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>{p.qty} {p.unit}</td>
                    <td>₹{p.price}</td>
                    <td>
                      {p.expiry}
                      {nearExpiry && <span className="expiry-warn"> ⚠️</span>}
                      {expired && <span className="expiry-warn"> ❌</span>}
                    </td>
                    <td><span className={`condition-badge ${meta.cssClass}`}>{meta.label}</span></td>
                    <td>
                      <button className="btn btn--ghost btn--sm" style={{color: '#f59e0b'}} onClick={() => handleDonate(p)} title="Donate to NGO">
                        <Heart size={15} />
                      </button>
                      <button className="btn btn--ghost btn--sm" onClick={() => removeProduct(p.id)} title="Remove">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {products.length === 0 && (
                <tr><td colSpan="7" className="table-empty">No products in inventory</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
