const express = require('express');
const {
  getReviews,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const { protect, authorize } = require('../middlewares/auth');

// mergeParams: true allows taking params from other routers (e.g., product router)
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, authorize('user', 'admin'), addReview);

router.route('/:id')
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
