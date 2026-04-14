import { Router } from 'express'
import { placeOrder, getOrders, getOrder, updateOrderStatus, generateInvoice } from '../controllers/orderController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

// Customer places order
router.post('/', authorize('customer'), placeOrder)

// Get orders (role-filtered)
router.get('/', authorize('customer', 'vendor', 'admin'), getOrders)
router.get('/:id', authorize('customer', 'vendor', 'admin'), getOrder)
router.get('/:id/invoice', authorize('customer', 'vendor', 'admin'), generateInvoice)

// Admin updates order status
router.patch('/:id/status', authorize('admin'), updateOrderStatus)

export default router