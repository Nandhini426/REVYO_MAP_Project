import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { productAPI, orderAPI, donationAPI } from '../services/api'
import { useAuth } from './AuthContext'

const ProductContext = createContext(null)

function loadState(key, fallback = []) {
  const saved = localStorage.getItem(key)
  if (saved) {
    try { return JSON.parse(saved) } catch {}
  }
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

export function ProductProvider({ children }) {
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(() => loadState('revyo_cart', []))
  const [pickups, setPickups] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ─────────────────────────────
  // FETCH ALL DATA
  // ─────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const [prodRes, ordRes, donRes] = await Promise.all([
        productAPI.getAll().catch(() => ({ products: [] })),
        orderAPI.getAll().catch(() => ({ orders: [] })),
        donationAPI.getAll().catch(() => ({ donations: [] }))
      ])

      setProducts(prodRes.products || [])
      setOrders(ordRes.orders || [])
      setPickups(donRes.donations || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ─────────────────────────────
  // PRODUCTS
  // ─────────────────────────────
  const addProduct = useCallback(async (product) => {
    try {
      const res = await productAPI.create(product)
      setProducts(prev => [res.product, ...prev])
    } catch (err) {
      console.error(err)
    }
  }, [])

  const removeProduct = useCallback(async (id) => {
    try {
      await productAPI.delete(id)
      setProducts(prev =>
        prev.filter(p => (p._id || p.id) !== id)
      )
    } catch (err) {
      console.error(err)
    }
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const res = await productAPI.update(id, updates)
      setProducts(prev =>
        prev.map(p => (p._id || p.id) === id ? { ...p, ...res.product } : p)
      )
    } catch (err) {
      console.error(err)
    }
  }, [])

  // ─────────────────────────────
  // FILTERS
  // ─────────────────────────────
  const customerProducts = products.filter(
    p => p.condition === 'fresh' || p.condition === 'semi'
  )

  const ngoProducts = products.filter(
    p => p.condition === 'spoiled'
  )

  const expiryAlerts = products.filter(p => {
    const exp = new Date(p.expiry)
    const now = new Date()
    const diff = (exp - now) / (1000 * 60 * 60 * 24)
    return diff <= 3
  })

  // ─────────────────────────────
  // CART
  // ─────────────────────────────
  const persist = (data) => {
    setCart(data)
    localStorage.setItem('revyo_cart', JSON.stringify(data))
  }

  const addToCart = useCallback((product) => {
    const id = product._id || product.id

    const existing = cart.find(c => (c._id || c.id) === id)

    let updated
    if (existing) {
      updated = cart.map(c =>
        (c._id || c.id) === id
          ? { ...c, cartQty: c.cartQty + 1 }
          : c
      )
    } else {
      updated = [...cart, { ...product, cartQty: 1 }]
    }

    persist(updated)
  }, [cart])

  const removeFromCart = useCallback((id) => {
    const updated = cart.filter(c => (c._id || c.id) !== id)
    persist(updated)
  }, [cart])

  const clearCart = useCallback(() => {
    persist([])
  }, [])

  // ─────────────────────────────
  // PLACE ORDER (🔥 FIXED)
  // ─────────────────────────────
  const placeOrder = useCallback(async () => {
  try {
    if (!cart || cart.length === 0) {
      throw new Error("Cart empty")
    }

    const items = cart.map(c => ({
      productId: c._id || c.id,
      qty: c.cartQty
    }))

    console.log("🔥 FINAL ORDER PAYLOAD SENT:", items)

    const res = await orderAPI.place({ items })

    setOrders(prev => [res.order, ...prev])
    clearCart()

    return res
  } catch (err) {
    console.error("ORDER ERROR:", err)
    throw err
  }
}, [cart, clearCart])
  // ─────────────────────────────
  // PICKUP (NGO)
  // ─────────────────────────────
  const acceptPickup = useCallback(async (product) => {
    try {
      const id = product._id || product.id
      const res = await donationAPI.claim(id)

      setPickups(prev =>
        prev.map(p =>
          (p._id || p.id) === id ? res.donation : p
        )
      )

      fetchAll()
    } catch (err) {
      console.error(err)
    }
  }, [fetchAll])

  // ─────────────────────────────
  // PROVIDER
  // ─────────────────────────────
  return (
    <ProductContext.Provider value={{
      products,
      customerProducts,
      ngoProducts,
      expiryAlerts,

      cart,
      orders,
      pickups,

      addProduct,
      removeProduct,
      updateProduct,

      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,

      acceptPickup,

      refreshData: fetchAll,

      loading,
      error
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => useContext(ProductContext)