const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Get reviews
// @route   GET /v1/reviews
// @route   GET /v1/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    let query;

    if (req.params.productId) {
      query = Review.find({ product: req.params.productId });
    } else {
      query = Review.find().populate({
        path: 'product',
        select: 'title description'
      });
    }

    const reviews = await query;
    sendResponse(res, 200, 'Reviews fetched successfully', reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
// @route   POST /v1/products/:productId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;

    const review = await Review.create(req.body);

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
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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
