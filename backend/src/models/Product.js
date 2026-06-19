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
    default: null
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

module.exports = mongoose.model('Product', productSchema);
