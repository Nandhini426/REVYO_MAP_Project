import dotenv from 'dotenv'
dotenv.config()

console.log("ENV CHECK:", process.env.MONGO_URI)
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'

// Route imports
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import donationRoutes from './routes/donationRoutes.js'

// ── Init ────────────────────────────────
const app = express()
const PORT = process.env.PORT || 5000

// ── Connect DB ──────────────────────────
connectDB()

// ── Middleware ───────────────────────────
app.use(cors({
  origin: "https://revyo-map-project.vercel.app",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }))

// ── API Routes ──────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/donations', donationRoutes)

// ── Health check ────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Static Files & Production Mode ───────
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))

  // Fallback to index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'))
  })
} else {
  // ── 404 handler for API (only active if not sending SPA) ─
  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` })
  })
}

// ── Error handler ───────────────────────
app.use(errorHandler)

// ── Start ───────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Revyo API running on http://localhost:${PORT}`)
  console.log(`📋 Endpoints:`)
  console.log(`   POST   /api/auth/register`)
  console.log(`   POST   /api/auth/login`)
  console.log(`   GET    /api/auth/me`)
  console.log(`   GET    /api/products`)
  console.log(`   POST   /api/products`)
  console.log(`   GET    /api/orders`)
  console.log(`   POST   /api/orders`)
  console.log(`   GET    /api/donations`)
  console.log(`   PATCH  /api/donations/:id/claim`)
  console.log(`   GET    /api/health\n`)
})
