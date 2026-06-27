const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

const normalizeSku = (value) => typeof value === 'string' ? value.trim().toUpperCase() : value;
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const allowedProductFields = [
  'title',
  'description',
  'shortDescription',
  'price',
  'discountPrice',
  'category',
  'subCategory',
  'images',
  'stock',
  'sku',
  'ply',
  'dimension',
  'sizeUnit',
  'gsm',
  'color',
  'bundle',
  'unit',
  'gstRate',
  'availabilityStatus',
  'thickness',
  'recyclable',
  'printingOption',
  'burstingFactor',
  'threeDModel',
  'specifications',
  'isFeatured',
  'status'
];

const pickProductFields = (body) => {
  const picked = {};
  allowedProductFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      picked[field] = body[field];
    }
  });
  return picked;
};

/**
 * Recursively strip any object key that starts with '$' from user input.
 * This prevents NoSQL operator injection (e.g. ?price[$where]=...) (bug #8)
 */
const sanitizeQuery = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$')) continue; // Drop injected operators
    clean[key] = sanitizeQuery(obj[key]);
  }
  return clean;
};

// @desc    Get all products (with filters, pagination, sorting)
// @route   GET /v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    let query;

    // Copy req.query and sanitize to prevent NoSQL injection
    const reqQuery = sanitizeQuery({ ...req.query });

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'minPrice', 'maxPrice', 'rating'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc) — safe because reqQuery is already sanitized
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse back
    let finalQuery = JSON.parse(queryStr);
    
    // Resolve Category slug or ID
    if (finalQuery.category) {
      if (!mongoose.Types.ObjectId.isValid(finalQuery.category)) {
        const categoryObj = await Category.findOne({ slug: finalQuery.category });
        if (categoryObj) {
          finalQuery.category = categoryObj._id;
        } else {
          finalQuery.category = new mongoose.Types.ObjectId();
        }
      }
    }

    // Search functionality (matching product title or matching categories)
    if (req.query.search) {
      const searchRegex = { $regex: escapeRegex(req.query.search), $options: 'i' };
      
      const matchingCategories = await Category.find({
        $or: [
          { name: searchRegex },
          { slug: searchRegex },
          { description: searchRegex }
        ]
      }).select('_id');
      
      const categoryIds = matchingCategories.map(cat => cat._id);

      finalQuery.$or = [
        { title: searchRegex },
        { category: { $in: categoryIds } }
      ];
    }

    // Price filters
    if (req.query.minPrice || req.query.maxPrice) {
      finalQuery.price = {};
      if (req.query.minPrice) {
        finalQuery.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        finalQuery.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Rating filter (averageRating >= rating)
    if (req.query.rating) {
      finalQuery.averageRating = { $gte: Number(req.query.rating) };
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
    let sortBy = '-createdAt';
    if (req.query.sort) {
      if (req.query.sort === 'price-asc') {
        sortBy = 'price';
      } else if (req.query.sort === 'price-desc') {
        sortBy = '-price';
      } else if (req.query.sort === 'rating-desc') {
        sortBy = '-averageRating';
      } else if (req.query.sort === 'moq-asc') {
        sortBy = 'specifications.value';
      } else {
        sortBy = req.query.sort.split(',').join(' ');
      }
    }
    query = query.sort(sortBy);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const startIndex = (page - 1) * limit;
    query = query.skip(startIndex).limit(limit);

    const [total, products] = await Promise.all([
      Product.countDocuments(finalQuery),
      query
    ]);

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid product id', 400));
    }

    const reviewPage = parseInt(req.query.reviewPage, 10) || 1;
    const reviewLimit = Math.min(parseInt(req.query.reviewLimit, 10) || 10, 50);
    const reviewSkip = (reviewPage - 1) * reviewLimit;

    const product = await Product.findById(req.params.id)
      .populate('category subCategory');

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    const [reviewsTotal, reviews] = await Promise.all([
      Review.countDocuments({ product: product._id }),
      Review.find({ product: product._id })
        .populate('user', 'firstName lastName avatar')
        .sort('-createdAt')
        .skip(reviewSkip)
        .limit(reviewLimit)
    ]);

    sendResponse(res, 200, 'Product fetched successfully', {
      ...product.toObject(),
      reviews,
      reviewsPagination: {
        page: reviewPage,
        limit: reviewLimit,
        total: reviewsTotal,
        pages: Math.ceil(reviewsTotal / reviewLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /v1/products
// @access  Private/Admin/Vendor
exports.createProduct = async (req, res, next) => {
  try {
    const productData = pickProductFields(req.body);
    productData.sku = normalizeSku(productData.sku);

    if (!productData.sku) {
      return next(new ErrorResponse('Product SKU is required', 400));
    }

    const existingSku = await Product.exists({ sku: productData.sku });
    if (existingSku) {
      return next(new ErrorResponse('This SKU is already assigned to another product', 400));
    }

    if (req.user.role === 'vendor') {
      productData.vendor = req.user.id;
      delete productData.isFeatured;
      delete productData.status;
    }

    const stockOnCreate = Number(productData.stock);
    if (!isNaN(stockOnCreate)) {
      if (stockOnCreate === 0) {
        productData.availabilityStatus = 'Out Of Stock';
      } else if (stockOnCreate > 0 && (!productData.availabilityStatus || productData.availabilityStatus === 'Out Of Stock')) {
        productData.availabilityStatus = 'In Stock';
      }
    }

    const product = await Product.create(productData);
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid product id', 400));
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    if (req.user.role !== 'admin' && (!product.vendor || product.vendor.toString() !== req.user.id)) {
      return next(new ErrorResponse('User not authorized to update this product', 403));
    }

    const productData = pickProductFields(req.body);

    if (req.user.role === 'vendor') {
      delete productData.isFeatured;
      delete productData.status;
    }

    if (Object.prototype.hasOwnProperty.call(productData, 'sku')) {
      productData.sku = normalizeSku(productData.sku);

      if (!productData.sku) {
        return next(new ErrorResponse('Product SKU is required', 400));
      }

      const existingSku = await Product.exists({
        sku: productData.sku,
        _id: { $ne: req.params.id }
      });
      if (existingSku) {
        return next(new ErrorResponse('This SKU is already assigned to another product', 400));
      }
    }

    // Always auto-derive availabilityStatus from stock if stock is being updated
    if (productData.stock !== undefined) {
      const stockNum = Number(productData.stock);
      if (stockNum === 0) {
        productData.availabilityStatus = 'Out Of Stock';
      } else if (stockNum > 0) {
        const currentStatus = productData.availabilityStatus || product.availabilityStatus;
        if (!currentStatus || currentStatus === 'Out Of Stock') {
          productData.availabilityStatus = 'In Stock';
        }
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, productData, {
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid product id', 400));
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    if (req.user.role !== 'admin' && (!product.vendor || product.vendor.toString() !== req.user.id)) {
      return next(new ErrorResponse('User not authorized to delete this product', 403));
    }

    await product.deleteOne();

    sendResponse(res, 200, 'Product deleted successfully', {});
  } catch (error) {
    next(error);
  }
};
