const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Get all categories
// @route   GET /v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    let filter = { isActive: true };

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { slug: searchRegex },
        { description: searchRegex }
      ];
    }

    let query = Category.find(filter);

    // Populate subCategories and product count
    query = query.populate('subCategories').populate('count');

    // Check if pagination parameters are provided
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const total = await Category.countDocuments(filter);

      query = query.skip(startIndex).limit(limit);

      const categories = await query;

      const pagination = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      };

      sendResponse(res, 200, 'Categories fetched successfully', categories, pagination);
    } else {
      const categories = await query;
      sendResponse(res, 200, 'Categories fetched successfully', categories);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /v1/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    sendResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /v1/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    sendResponse(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    await category.deleteOne(); // Trigger pre-remove if any
    sendResponse(res, 200, 'Category deleted successfully', {});
  } catch (error) {
    next(error);
  }
};

// --- SubCategories ---

// @desc    Create subcategory
// @route   POST /v1/categories/:categoryId/subcategories
// @access  Private/Admin
exports.createSubCategory = async (req, res, next) => {
  try {
    req.body.category = req.params.categoryId;
    const subCategory = await SubCategory.create(req.body);
    sendResponse(res, 201, 'SubCategory created successfully', subCategory);
  } catch (error) {
    next(error);
  }
};
