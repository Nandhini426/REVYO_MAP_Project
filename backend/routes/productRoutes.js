import { Router } from 'express'
import { body } from 'express-validator'
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js'
import { protect, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// All product routes require authentication
router.use(protect)

// GET — role-filtered products
router.get('/', getProducts)
router.get('/:id', getProduct)

// POST — vendor only
router.post(
  '/',
  authorize('vendor'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
    body('condition').isIn(['fresh', 'semi', 'spoiled']).withMessage('Invalid condition'),
    body('expiry').isISO8601().withMessage('Valid expiry date is required'),
    validate,
  ],
  createProduct
)

// PUT — vendor (own) + admin
router.put('/:id', authorize('vendor', 'admin'), updateProduct)

// DELETE — vendor (own) + admin
router.delete('/:id', authorize('vendor', 'admin'), deleteProduct)

export default router