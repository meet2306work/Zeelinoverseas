const express = require('express');
const router = express.Router();
const {
  createRfq,
  getRfqs,
  getMyRfqs,
  updateRfqStatus
} = require('../controllers/rfqController');
const { protect, optionalProtect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(optionalProtect, createRfq)
  .get(protect, authorize('admin'), getRfqs);

router.route('/myrfqs').get(protect, getMyRfqs);

router.route('/:id').put(protect, authorize('admin'), updateRfqStatus);

module.exports = router;
