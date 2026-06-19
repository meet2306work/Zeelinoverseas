const express = require('express');
const router = express.Router();
const {
  createRfq,
  getRfqs,
  getMyRfqs,
  updateRfqStatus
} = require('../controllers/rfqController');
const { protect, authorize } = require('../middlewares/auth');

// Try to extract user if token is present, but don't fail if not
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    protect(req, res, next);
  } else {
    next();
  }
};

router.route('/')
  .post(optionalProtect, createRfq)
  .get(protect, authorize('admin'), getRfqs);

router.route('/myrfqs').get(protect, getMyRfqs);

router.route('/:id').put(protect, authorize('admin'), updateRfqStatus);

module.exports = router;
