import Donation from '../models/Donation.js'

// ────────────────────────────────────────
// POST /api/donations
// ────────────────────────────────────────
export const createDonation = async (req, res, next) => {
  try {
    const { itemName, quantity, unit, product } = req.body

    const donation = await Donation.create({
      product: product || "000000000000000000000000",
      productName: itemName,
      qty: parseFloat(quantity) || 1,
      unit: unit || 'kg',
      vendor: req.user._id,
      vendorName: req.user.username,
      status: 'Available'
    })

    res.status(201).json({ success: true, donation })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/donations
//   ngo    → available donations
//   vendor → own donations
//   admin  → all
// ────────────────────────────────────────
export const getDonations = async (req, res, next) => {
  try {
    let filter = {}

    if (req.user.role === 'ngo') {
      // NGOs see available donations + their claimed ones
      filter.$or = [
        { status: 'Available' },
        { ngo: req.user._id },
      ]
    } else if (req.user.role === 'vendor') {
      filter.vendor = req.user._id
    }
    // admin gets all

    const donations = await Donation.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: donations.length, donations })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// PATCH /api/donations/:id/claim  (ngo only)
// ────────────────────────────────────────
export const claimDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
    if (!donation) return res.status(404).json({ message: 'Donation not found' })

    if (donation.status !== 'Available') {
      return res.status(400).json({ message: 'This donation is already claimed' })
    }

    donation.status = 'Claimed'
    donation.ngo = req.user._id
    donation.ngoName = req.user.username
    await donation.save()

    res.json({ success: true, donation })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// PATCH /api/donations/:id/pickup  (ngo only)
// ────────────────────────────────────────
export const confirmPickup = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
    if (!donation) return res.status(404).json({ message: 'Donation not found' })

    if (donation.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the claiming NGO can confirm pickup' })
    }

    if (donation.status !== 'Claimed') {
      return res.status(400).json({ message: 'Donation must be claimed before pickup' })
    }

    donation.status = 'Picked Up'
    await donation.save()

    res.json({ success: true, donation })
  } catch (error) {
    next(error)
  }
}

// ────────────────────────────────────────
// GET /api/donations/stats  (admin only)
// ────────────────────────────────────────
export const getDonationStats = async (req, res, next) => {
  try {
    const total = await Donation.countDocuments()
    const available = await Donation.countDocuments({ status: 'Available' })
    const claimed = await Donation.countDocuments({ status: 'Claimed' })
    const pickedUp = await Donation.countDocuments({ status: 'Picked Up' })

    res.json({
      success: true,
      stats: { total, available, claimed, pickedUp },
    })
  } catch (error) {
    next(error)
  }
}