import Order from '../models/Order.js'
import Product from '../models/Product.js'
import PDFDocument from 'pdfkit'

// ────────────────────────────────────────
// POST /api/orders  (customer only)
// ────────────────────────────────────────
export const placeOrder = async (req, res, next) => {
  try {
    const { items } = req.body

    // 🔥 SAFETY FIX (prevents "items is not iterable")
    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: 'Invalid items format'
      })
    }

    if (items.length === 0) {
      return res.status(400).json({
        message: 'Order must have at least one item'
      })
    }

    let total = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.productId} not found`
        })
      }

      if (product.condition === 'spoiled') {
        return res.status(400).json({
          message: `Cannot purchase spoiled items: ${product.name}`
        })
      }

      if (item.qty > product.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        })
      }

      const unitPrice =
        product.condition === 'semi'
          ? product.price * (1 - (product.discount || 0) / 100)
          : product.price

      orderItems.push({
        product: product._id,
        name: product.name,
        qty: item.qty,
        price: unitPrice,
        image: product.image
      })

      total += unitPrice * item.qty

      // reduce stock
      product.qty -= item.qty
      await product.save()
    }

    const order = await Order.create({
      customer: req.user._id,
      customerName: req.user.username,
      items: orderItems,
      total
    })

    res.status(201).json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/orders
// ────────────────────────────────────────
export const getOrders = async (req, res, next) => {
  try {
    let filter = {}

    if (req.user.role === 'customer') {
      filter.customer = req.user._id
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/orders/:id
// ────────────────────────────────────────
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      })
    }

    if (
      req.user.role === 'customer' &&
      order.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized to view this order'
      })
    }

    res.json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// PATCH /api/orders/:id/status
// ────────────────────────────────────────
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    if (!['Pending', 'Confirmed', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/orders/:id/invoice
// ────────────────────────────────────────
export const generateInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (
      req.user.role === 'customer' &&
      order.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const doc = new PDFDocument({ margin: 50 })
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`)
    
    doc.pipe(res)

    doc.fontSize(20).text('Revyo Invoice', { align: 'center' })
    doc.moveDown()
    
    doc.fontSize(12).text(`Order ID: ${order._id}`)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
    doc.text(`Customer Name: ${order.customerName || 'N/A'}`)
    doc.text(`Status: ${order.status}`)
    doc.moveDown()

    doc.text('Items:', { underline: true })
    doc.moveDown(0.5)

    order.items.forEach(item => {
      doc.text(`${item.name} x${item.qty}   -   Rs. ${item.price * item.qty}`)
    })

    doc.moveDown()
    doc.fontSize(14).text(`Total: Rs. ${order.total}`, { bold: true })
    
    doc.end()
  } catch (error) {
    next(error)
  }
}