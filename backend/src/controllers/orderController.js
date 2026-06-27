const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

const deductStockForOrder = async (order, session) => {
  for (const item of order.orderItems) {
    const result = await Product.findOneAndUpdate(
      {
        _id: item.product,
        stock: { $gte: item.qty },
        availabilityStatus: { $nin: ['Out Of Stock', 'Archived'] }
      },
      { $inc: { stock: -item.qty } },
      { session, new: true }
    );

    if (!result) {
      throw new ErrorResponse(`Insufficient stock for "${item.name}". Please review the order before marking it paid.`, 409);
    }
  }
};

// @desc    Create new order
// @route   POST /v1/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new ErrorResponse('No order items', 400));
    }

    // Bug #7: Recalculate all prices from the database — never trust the client
    const productIds = orderItems.map(item => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).select('price stock availabilityStatus title images sku');

    const productMap = {};
    dbProducts.forEach(p => { productMap[p._id.toString()] = p; });

    // Validate stock availability and build verified order items
    const verifiedItems = [];
    for (const item of orderItems) {
      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty < 1) {
        return next(new ErrorResponse('Order item quantity must be a positive integer', 400));
      }

      const dbProduct = productMap[item.product];
      if (!dbProduct) {
        return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
      }
      if (dbProduct.stock < qty) {
        return next(new ErrorResponse(`Insufficient stock for "${dbProduct.title}". Available: ${dbProduct.stock}`, 400));
      }
      if (['Out Of Stock', 'Archived'].includes(dbProduct.availabilityStatus)) {
        return next(new ErrorResponse(`Product "${dbProduct.title}" is no longer available`, 400));
      }
      verifiedItems.push({
        product: item.product,
        name: dbProduct.title,
        qty,
        image: dbProduct.images?.[0]?.url || '',
        price: dbProduct.price, // ← always from DB, never from client
      });
    }

    // Recalculate totals server-side (Bug #7)
    const itemsPrice = verifiedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const taxRate = 0.18; // 18% GST
    const taxPrice = parseFloat((itemsPrice * taxRate).toFixed(2));
    const shippingPrice = itemsPrice > 1000 ? 0 : 100; // free shipping over ₹1000
    const totalPrice = parseFloat((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    const order = new Order({
      orderItems: verifiedItems,
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
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid order id', 400));
    }

    const order = await Order.findById(req.params.id).populate(
      'user',
      'firstName lastName email'
    );

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to view this order', 403));
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
  const session = await mongoose.startSession();

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid order id', 400));
    }

    const { provider, transactionId, payerEmail } = req.body;

    if (!provider || !transactionId) {
      return next(new ErrorResponse('Payment provider and transaction id are required', 400));
    }

    let updatedOrder;
    await session.withTransaction(async () => {
      const order = await Order.findById(req.params.id).session(session);

      if (!order) {
        throw new ErrorResponse('Order not found', 404);
      }

      if (order.isPaid) {
        updatedOrder = order;
        return;
      }

      await deductStockForOrder(order, session);

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: transactionId,
        status: 'VERIFIED',
        update_time: new Date().toISOString(),
        email_address: payerEmail || ''
      };

      updatedOrder = await order.save({ session });
    });

    sendResponse(res, 200, 'Order paid successfully', updatedOrder);
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Update order to delivered
// @route   PUT /v1/orders/:id/deliver
// @access  Private/Admin/Vendor
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid order id', 400));
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Bug #11: Cannot deliver an unpaid order
    if (!order.isPaid) {
      return next(new ErrorResponse('Cannot mark an unpaid order as delivered', 400));
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
    // Bug #12: Add pagination — never return unbounded result sets
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user.id });
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, 'My orders fetched successfully', orders, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /v1/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    // Bug #12: Add pagination — never return all orders at once
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate('user', 'id firstName lastName')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, 'All orders fetched successfully', orders, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status and logistics
// @route   PUT /v1/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid order id', 400));
    }

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
