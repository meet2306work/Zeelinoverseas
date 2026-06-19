const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Get all categories
// @route   GET /v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).populate('subCategories');
    sendResponse(res, 200, 'Categories fetched successfully', categories);
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
