import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Protect routes — verifies JWT and attaches user to req.
 */
export const protect = async (req, res, next) => {
  try {
    let token = null

    // Extract token from Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized — no token provided' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user (without password)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Not authorized — user not found' })
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended — contact admin' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired — please login again' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    return res.status(401).json({ message: 'Not authorized' })
  }
}

/**
 * Role-based authorization — restricts to specific roles.
 * Usage: authorize('admin', 'vendor')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this resource`,
      })
    }
    next()
  }
}