const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Create new order
// @route   POST /v1/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
  const appliedStockUpdates = [];

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

    // Bug #6: Atomically decrement stock for each ordered item
    for (const item of verifiedItems) {
      const result = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.qty } }, // stock check is atomic
        { $inc: { stock: -item.qty } }
      );
      if (!result) {
        await Promise.all(appliedStockUpdates.map(update =>
          Product.findByIdAndUpdate(update.product, { $inc: { stock: update.qty } })
        ));
        return next(new ErrorResponse(`Stock ran out for "${item.name}" during checkout. Please refresh your cart.`, 409));
      }
      appliedStockUpdates.push(item);
    }

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
    if (appliedStockUpdates.length > 0) {
      await Promise.all(appliedStockUpdates.map(update =>
        Product.findByIdAndUpdate(update.product, { $inc: { stock: update.qty } })
      ));
    }
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
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Ownership check — only the order owner or admin may mark as paid
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this order', 403));
    }

    // Guard against missing payer object from payment gateway
    if (!req.body.payer || !req.body.payer.email_address) {
      return next(new ErrorResponse('Invalid payment result: payer information is missing', 400));
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
