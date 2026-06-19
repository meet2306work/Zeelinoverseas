const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory
} = require('../controllers/categoryController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

router.route('/:id')
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

router.route('/:categoryId/subcategories')
  .post(protect, authorize('admin'), createSubCategory);

module.exports = router;
