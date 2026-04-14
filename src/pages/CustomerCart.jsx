import { useProducts } from '../context/ProductContext.jsx'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CustomerCart() {
  const { cart, removeFromCart, clearCart, placeOrder } = useProducts()
  const navigate = useNavigate()

  const getItemPrice = (c) => {
    return c.condition === 'semi' && c.discount
      ? c.price * (1 - (c.discount || 0) / 100)
      : c.price
  }

  const total = cart.reduce(
    (sum, c) => sum + getItemPrice(c) * c.cartQty,
    0
  )

  const handlePlaceOrder = async () => {
  try {
    const response = await placeOrder()

    console.log("ORDER SUCCESS:", response)

    clearCart()

    alert("Order placed successfully!")

    navigate('/customer')
  } catch (err) {
    console.error("Order failed:", err)
    alert(err.message || "Order failed")
  }
}

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => navigate('/customer')}
            style={{ marginBottom: 8 }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <h1 className="page-title">My Cart</h1>
          <p className="page-subtitle">
            Review your items and place your order.
          </p>
        </div>
      </div>

      {cart.length > 0 ? (
        <div className="card" id="cart-section">
          <div className="card__header">
            <h2>
              <ShoppingCart size={20} /> Cart Items
            </h2>

            <button
              className="btn btn--ghost btn--sm"
              onClick={clearCart}
            >
              Clear All
            </button>
          </div>

          <div className="cart-items">
            {cart.map((c) => {
              const finalPrice = getItemPrice(c)

              return (
                <div key={c.id || c.id} className="cart-item">
                  <span className="cart-item__emoji">
                    {c.image || '🥦'}
                  </span>

                  <div className="cart-item__info">
                    <span className="cart-item__name">
                      {c.name}
                    </span>

                    <span className="cart-item__qty">
                      Qty: {c.cartQty} × ₹{finalPrice.toFixed(0)}
                    </span>
                  </div>

                  <span className="cart-item__total">
                    ₹{(finalPrice * c.cartQty).toFixed(0)}
                  </span>

                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => removeFromCart(c.id || c.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="cart-footer">
            <span className="cart-footer__total">
              Total: ₹{total.toFixed(0)}
            </span>

            <button
              className="btn btn--primary"
              id="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <span className="empty-state__icon">🛒</span>

            <p>
              Your cart is empty. Browse the marketplace to find fresh produce!
            </p>

            <button
              className="btn btn--primary"
              onClick={() => navigate('/customer/marketplace')}
              style={{ marginTop: 16 }}
            >
              Go to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  )
}