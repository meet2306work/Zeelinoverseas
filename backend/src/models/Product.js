const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  shortDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  discountPrice: {
    type: Number,
    default: null
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'SubCategory',
    default: null
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false // Optional depending if vendor logic is active
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  stock: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'Product SKU is required'],
    trim: true,
    uppercase: true,
    unique: true,
    sparse: true,
    maxlength: [64, 'Product SKU cannot exceed 64 characters'],
    match: [/^[A-Z0-9][A-Z0-9_-]*$/, 'Product SKU can only contain letters, numbers, hyphens, and underscores']
  },
  ply: {
    type: String,
    default: null
  },
  dimension: {
    type: String,
    default: null
  },
  sizeUnit: {
    type: String,
    enum: ['mm', 'cm', 'inch'],
    default: 'mm'
  },
  gsm: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: null
  },
  bundle: {
    type: String,
    default: null
  },
  unit: {
    type: String,
    enum: ['pcs', 'bundle'],
    default: 'pcs'
  },
  gstRate: {
    type: Number,
    default: 18
  },
  availabilityStatus: {
    type: String,
    enum: ['In Stock', 'Out Of Stock', 'Pre-Order', 'Archived'],
    default: 'In Stock'
  },
  thickness: {
    type: String,
    default: null
  },
  recyclable: {
    type: Boolean,
    default: true
  },
  printingOption: {
    type: String,
    enum: ['Plain', 'Printed'],
    default: 'Plain'
  },
  burstingFactor: {
    type: String,
    default: null
  },
  threeDModel: {
    url: { type: String, default: null },
    public_id: { type: String, default: null }
  },
  specifications: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'out_of_stock', 'archived'],
    default: 'published'
  },
  averageRating: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

// Auto-generate slug from title if not provided
productSchema.pre('validate', function () {
  if (!this.slug && this.title) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    // Add a short unique suffix to prevent duplicate slugs
    const suffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    this.slug = `${baseSlug}-${suffix}`;
  }
});

module.exports = mongoose.model('Product', productSchema);
