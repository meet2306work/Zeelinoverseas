const Rfq = require('../models/Rfq');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Create an RFQ
// @route   POST /v1/rfq
// @access  Public (or Private if logged in)
exports.createRfq = async (req, res, next) => {
  try {
    // Whitelist fields — never pass req.body directly to Rfq.create() (bug #5)
    const {
      contactName,
      email,
      phone,
      companyName,
      productDetails,
      quantity,
      targetPrice,
      shippingDestination,
      requirements,
      attachments
    } = req.body;

    const rfqData = {
      contactName,
      email,
      phone,
      companyName,
      productDetails,
      quantity,
      targetPrice,
      shippingDestination,
      requirements,
      attachments
    };

    // Only attach authenticated user if token was present
    if (req.user) {
      rfqData.user = req.user.id;
    }

    const rfq = await Rfq.create(rfqData);
    sendResponse(res, 201, 'RFQ created successfully', rfq);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all RFQs
// @route   GET /v1/rfq
// @access  Private/Admin
exports.getRfqs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const [total, rfqs] = await Promise.all([
      Rfq.countDocuments({}),
      Rfq.find().sort('-createdAt').skip(skip).limit(limit)
    ]);

    sendResponse(res, 200, 'RFQs fetched successfully', rfqs, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get My RFQs
// @route   GET /v1/rfq/myrfqs
// @access  Private
exports.getMyRfqs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;
    const filter = { user: req.user.id };

    const [total, rfqs] = await Promise.all([
      Rfq.countDocuments(filter),
      Rfq.find(filter).sort('-createdAt').skip(skip).limit(limit)
    ]);

    sendResponse(res, 200, 'My RFQs fetched successfully', rfqs, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update RFQ Status
// @route   PUT /v1/rfq/:id
// @access  Private/Admin
exports.updateRfqStatus = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid RFQ id', 400));
    }

    let rfq = await Rfq.findById(req.params.id);

    if (!rfq) {
      return next(new ErrorResponse('RFQ not found', 404));
    }

    rfq.status = req.body.status || rfq.status;
    // Bug #24: Use hasOwnProperty so targetPrice: 0 is accepted (0 is falsy, || skips it)
    if (Object.prototype.hasOwnProperty.call(req.body, 'targetPrice') && req.body.targetPrice !== null) {
      rfq.targetPrice = req.body.targetPrice;
    }
    
    await rfq.save();

    sendResponse(res, 200, 'RFQ updated successfully', rfq);
  } catch (error) {
    next(error);
  }
};
