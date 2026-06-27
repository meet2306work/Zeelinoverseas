const Rfq = require('../models/Rfq');
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
    const rfqs = await Rfq.find().sort('-createdAt');
    sendResponse(res, 200, 'RFQs fetched successfully', rfqs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get My RFQs
// @route   GET /v1/rfq/myrfqs
// @access  Private
exports.getMyRfqs = async (req, res, next) => {
  try {
    const rfqs = await Rfq.find({ user: req.user.id }).sort('-createdAt');
    sendResponse(res, 200, 'My RFQs fetched successfully', rfqs);
  } catch (error) {
    next(error);
  }
};

// @desc    Update RFQ Status
// @route   PUT /v1/rfq/:id
// @access  Private/Admin
exports.updateRfqStatus = async (req, res, next) => {
  try {
    let rfq = await Rfq.findById(req.params.id);

    if (!rfq) {
      return next(new ErrorResponse('RFQ not found', 404));
    }

    rfq.status = req.body.status || rfq.status;
    rfq.targetPrice = req.body.targetPrice || rfq.targetPrice;
    
    await rfq.save();

    sendResponse(res, 200, 'RFQ updated successfully', rfq);
  } catch (error) {
    next(error);
  }
};
