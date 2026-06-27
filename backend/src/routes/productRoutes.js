const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, optionalProtect, authorize } = require('../middlewares/auth');

// Include other resource routers
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

router.route('/')
  .get(optionalProtect, getProducts)
  .post(protect, authorize('admin', 'vendor'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin', 'vendor'), updateProduct)
  .delete(protect, authorize('admin', 'vendor'), deleteProduct);

module.exports = router;
