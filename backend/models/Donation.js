import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    productName: { type: String, required: true },
    qty: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendorName: { type: String, required: true },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ngoName: { type: String, default: null },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Picked Up'],
      default: 'Available',
    },
  },
  { timestamps: true }
)

donationSchema.index({ status: 1 })
donationSchema.index({ ngo: 1 })

const Donation = mongoose.model('Donation', donationSchema)
export default Donation