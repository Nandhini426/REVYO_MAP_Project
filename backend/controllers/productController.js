import Product from '../models/Product.js'
import Donation from '../models/Donation.js'

// ────────────────────────────────────────
// GET /api/products
// Role-based filtering:
//   customer → fresh + semi only
//   ngo      → spoiled only
//   vendor   → own products
//   admin    → all
// ────────────────────────────────────────
export const getProducts = async (req, res, next) => {
  try {
    const { role } = req.user
    let filter = {}

    if (role === 'customer') {
      filter.condition = { $in: ['fresh', 'semi'] }
    } else if (role === 'ngo') {
      filter.condition = 'spoiled'
    } else if (role === 'vendor') {
      filter.vendor = req.user._id
    }
    // admin gets everything (no filter)

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: products.length, products })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/products/:id
// ────────────────────────────────────────
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    // Enforce visibility rules
    const { role } = req.user
    if (role === 'customer' && product.condition === 'spoiled') {
      return res.status(403).json({ message: 'This product is not available' })
    }
    if (role === 'ngo' && product.condition !== 'spoiled') {
      return res.status(403).json({ message: 'Only spoiled items are visible to NGOs' })
    }

    res.json({ success: true, product })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// POST /api/products  (vendor only)
// ────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const { name, category, qty, unit, price, condition, discount, expiry, image } = req.body

    const product = await Product.create({
      name,
      category,
      qty,
      unit,
      price,
      condition,
      discount: condition === 'semi' ? (discount || 30) : 0,
      expiry,
      image,
      vendor: req.user._id,
      vendorName: req.user.username,
    })

    // If spoiled, automatically create a donation entry
    if (condition === 'spoiled') {
      await Donation.create({
        product: product._id,
        productName: product.name,
        qty: product.qty,
        unit: product.unit,
        vendor: req.user._id,
        vendorName: req.user.username,
      })
    }

    res.status(201).json({ success: true, product })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// PUT /api/products/:id  (vendor — own products only)
// ────────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    // Vendors can only update their own products
    if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own products' })
    }

    const oldCondition = product.condition

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    // If condition changed to spoiled, create donation
    if (oldCondition !== 'spoiled' && product.condition === 'spoiled') {
      await Donation.create({
        product: product._id,
        productName: product.name,
        qty: product.qty,
        unit: product.unit,
        vendor: product.vendor,
        vendorName: product.vendorName,
      })
    }

    res.json({ success: true, product })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// DELETE /api/products/:id  (vendor — own only, admin — any)
// ────────────────────────────────────────
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own products' })
    }

    await Product.findByIdAndDelete(req.params.id)
    // Remove associated donations
    await Donation.deleteMany({ product: req.params.id })

    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    next(error)
  }
}