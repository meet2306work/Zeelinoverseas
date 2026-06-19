const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Create new order
// @route   POST /v1/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return next(new ErrorResponse('No order items', 400));
    } else {
      const order = new Order({
        orderItems,
        user: req.user.id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      sendResponse(res, 201, 'Order created successfully', createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'firstName lastName email'
    );

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to view this order', 401));
    }

    sendResponse(res, 200, 'Order fetched successfully', order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    sendResponse(res, 200, 'Order paid successfully', updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /v1/orders/:id/deliver
// @access  Private/Admin/Vendor
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = 'Delivered';

    const updatedOrder = await order.save();
    sendResponse(res, 200, 'Order delivered successfully', updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /v1/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    sendResponse(res, 200, 'My orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /v1/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id firstName lastName').sort('-createdAt');
    sendResponse(res, 200, 'All orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status and logistics
// @route   PUT /v1/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.orderStatus = req.body.status || order.orderStatus;
    order.shippingLine = req.body.shippingLine || order.shippingLine;
    order.trackingNo = req.body.trackingNo || order.trackingNo;

    const updatedOrder = await order.save();
    sendResponse(res, 200, 'Order updated successfully', updatedOrder);
  } catch (error) {
    next(error);
  }
};
