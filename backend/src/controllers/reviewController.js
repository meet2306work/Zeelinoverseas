const Review = require('../models/Review');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Get reviews
// @route   GET /v1/reviews
// @route   GET /v1/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    if (req.params.productId) {
      // Product-specific reviews — no pagination needed (usually small set)
      const reviews = await Review.find({ product: req.params.productId })
        .populate('user', 'firstName lastName avatar')
        .sort('-createdAt');
      return sendResponse(res, 200, 'Reviews fetched successfully', reviews);
    }

    // Admin: all reviews — paginated (Bug #20)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({});
    const reviews = await Review.find()
      .populate({ path: 'product', select: 'title description' })
      .populate('user', 'firstName lastName')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, 'Reviews fetched successfully', reviews, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
// @route   POST /v1/products/:productId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Bug #22: Verify the user has actually purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      isPaid: true,
      'orderItems.product': productId,
    });

    if (!hasPurchased) {
      return next(new ErrorResponse('You can only review products you have purchased and paid for', 403));
    }

    // Whitelist allowed fields — never pass req.body directly (Bug #23)
    const { title, text, rating } = req.body;
    const review = await Review.create({
      title,
      text,
      rating,
      product: productId,
      user: req.user.id,
    });

    sendResponse(res, 201, 'Review created successfully', review);
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update review', 403));
    }

    // Bug #23: Whitelist only allowed fields — prevent product/user field overwrite
    const { title, text, rating } = req.body;
    review = await Review.findByIdAndUpdate(
      req.params.id,
      { title, text, rating },
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, 'Review updated successfully', review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to delete review`, 401));
    }

    await review.deleteOne();

    sendResponse(res, 200, 'Review deleted successfully', {});
  } catch (error) {
    next(error);
  }
};
