const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

const normalizeSku = (value) => typeof value === 'string' ? value.trim().toUpperCase() : value;

// @desc    Get all products (with filters, pagination, sorting)
// @route   GET /v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse back
    let finalQuery = JSON.parse(queryStr);
    
    // Search functionality
    if (req.query.search) {
      finalQuery.title = { $regex: req.query.search, $options: 'i' };
    }

    // Only active published products for public
    if (!req.user || req.user.role === 'user') {
       finalQuery.status = 'published';
    }

    query = Product.find(finalQuery).populate({
      path: 'category subCategory',
      select: 'name slug'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(finalQuery);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query;

    // Pagination result
    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };

    sendResponse(res, 200, 'Products fetched successfully', products, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category subCategory')
      .populate('reviews');

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }
    sendResponse(res, 200, 'Product fetched successfully', product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /v1/products
// @access  Private/Admin/Vendor
exports.createProduct = async (req, res, next) => {
  try {
    req.body.sku = normalizeSku(req.body.sku);

    if (!req.body.sku) {
      return next(new ErrorResponse('Product SKU is required', 400));
    }

    const existingSku = await Product.exists({ sku: req.body.sku });
    if (existingSku) {
      return next(new ErrorResponse('This SKU is already assigned to another product', 400));
    }

    // Add vendor logic if role is vendor
    if (req.user.role === 'vendor') {
      req.body.vendor = req.user.id;
    }

    const product = await Product.create(req.body);
    sendResponse(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /v1/products/:id
// @access  Private/Admin/Vendor
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product vendor or admin
    if (product.vendor && product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to update this product`, 401));
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'sku')) {
      req.body.sku = normalizeSku(req.body.sku);

      if (!req.body.sku) {
        return next(new ErrorResponse('Product SKU is required', 400));
      }

      const existingSku = await Product.exists({
        sku: req.body.sku,
        _id: { $ne: req.params.id }
      });
      if (existingSku) {
        return next(new ErrorResponse('This SKU is already assigned to another product', 400));
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    sendResponse(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /v1/products/:id
// @access  Private/Admin/Vendor
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    if (product.vendor && product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to delete this product`, 401));
    }

    await product.deleteOne();

    sendResponse(res, 200, 'Product deleted successfully', {});
  } catch (error) {
    next(error);
  }
};
