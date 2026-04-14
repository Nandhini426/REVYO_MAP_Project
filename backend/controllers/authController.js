import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

// ────────────────────────────────────────
// POST /api/auth/register
// ────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body

    console.log("👉 REGISTER DATA:", { username, email, password, role })

    // Check if user already exists
    const existing = await User.findOne({ $or: [{ email }, { username }] }).select('+password')
    if (existing) {
      // If they exist, let's see if their password matches. If so, just gracefully log them in.
      const isMatch = await existing.comparePassword(password)
      if (isMatch) {
        console.log("✅ AUTO-LOGIN ON REGISTER PAGE FOR EXISTING USER")
        const token = generateToken(existing._id, existing.role)
        return res.status(200).json({
          success: true,
          message: 'User already exists, logged in instead.',
          token,
          user: {
            id: existing._id,
            username: existing.username,
            email: existing.email,
            role: existing.role,
            status: existing.status,
          },
        })
      } else {
        return res.status(400).json({ message: 'User already exists. If this is your account, please enter the correct password or login.' })
      }
    }

    const user = await User.create({ username, email, password, role })

    console.log("✅ USER CREATED:", user)

    const token = generateToken(user._id, user.role)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error)
    next(error)
  }
}

// ────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body

    const identifier = email || username

    console.log("👉 LOGIN IDENTIFIER:", identifier)

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' })
    }

    // Find user by email OR username + include password
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    }).select('+password')

    console.log("👉 USER FOUND:", user)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended' })
    }

    const isMatch = await user.comparePassword(password)

    console.log("👉 PASSWORD MATCH:", isMatch)

    if (!isMatch) {
      return res.status(401).json({ message: 'Password incorrect' })
    }

    const token = generateToken(user._id, user.role)

    console.log("✅ LOGIN SUCCESS")

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error)
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/auth/me
// ────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        createdAt: req.user.createdAt,
      },
    })
  } catch (error) {
    console.error("❌ GET ME ERROR:", error)
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/auth/users
// ────────────────────────────────────────
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v').sort({ createdAt: -1 })
    res.json({ success: true, count: users.length, users })
  } catch (error) {
    console.error("❌ GET USERS ERROR:", error)
    next(error)
  }
}

// ────────────────────────────────────────
// PATCH /api/auth/users/:id/status
// ────────────────────────────────────────
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-__v')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error("❌ UPDATE STATUS ERROR:", error)
    next(error)
  }
}