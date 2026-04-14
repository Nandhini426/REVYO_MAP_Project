import { Router } from 'express'
import {
  getDonations, claimDonation, confirmPickup, getDonationStats, createDonation
} from '../controllers/donationController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

// Get donations (role-filtered)
router.get('/', authorize('ngo', 'vendor', 'admin'), getDonations)

// Create donation
router.post('/', authorize('vendor', 'admin'), createDonation)

// NGO claims a donation
router.patch('/:id/claim', authorize('ngo'), claimDonation)

// NGO confirms pickup
router.patch('/:id/pickup', authorize('ngo'), confirmPickup)

// Admin stats
router.get('/stats', authorize('admin'), getDonationStats)

export default router