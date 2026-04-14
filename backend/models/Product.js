import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Vegetables', 'Fruits', 'Leafy Greens', 'Exotic', 'Others'],
      default: 'Vegetables',
    },
    qty: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      enum: ['kg', 'units', 'bundles'],
      default: 'kg',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    condition: {
      type: String,
      enum: ['fresh', 'semi', 'spoiled'],
      default: 'fresh',
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    expiry: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    image: {
      type: String,
      default: '🥦',
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

// Index for efficient queries by condition and vendor
productSchema.index({ condition: 1 })
productSchema.index({ vendor: 1 })

const Product = mongoose.model('Product', productSchema)
export default Product