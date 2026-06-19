const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false // Can be guest
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  companyName: {
    type: String,
    default: ''
  },
  productDetails: {
    type: String,
    required: [true, 'Product details are required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  targetPrice: {
    type: Number,
    default: null
  },
  shippingDestination: {
    type: String,
    required: [true, 'Shipping destination is required']
  },
  requirements: {
    type: String,
    default: ''
  },
  attachments: [
    {
      url: String,
      public_id: String
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Quoted', 'Rejected', 'Accepted'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rfq', rfqSchema);
