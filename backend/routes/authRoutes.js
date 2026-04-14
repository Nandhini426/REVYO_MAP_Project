import { Router } from 'express'
import User from '../models/User.js'
import { body } from 'express-validator'
import { register, login, getMe, getAllUsers, updateUserStatus } from '../controllers/authController.js'
import { protect, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// ── Public ──────────────────────────────
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['vendor', 'customer', 'ngo', 'admin']).withMessage('Invalid role'),
    validate,
  ],
  register
)

router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Username or Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
)

router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: true, message: 'User found' });
    }
    return res.status(404).json({ message: 'No account found with this email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
})

// ── Protected ───────────────────────────
router.get('/me', protect, getMe)

// ── Admin only ──────────────────────────
router.get('/users', protect, authorize('admin'), getAllUsers)
router.patch('/users/:id/status', protect, authorize('admin'), updateUserStatus)

export default router