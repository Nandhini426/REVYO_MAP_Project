import jwt from 'jsonwebtoken'

/**
 * Generate a signed JWT for a given user ID + role.
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}
