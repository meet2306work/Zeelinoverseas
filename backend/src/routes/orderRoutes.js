const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, authorize('admin'), updateOrder);

router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/deliver').put(protect, authorize('admin', 'vendor'), updateOrderToDelivered);

module.exports = router;
