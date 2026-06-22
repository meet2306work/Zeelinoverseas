const express = require('express');
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  // Administrative controllers
  getAllUsers,
  updateUserAdmin,
  deleteUserAdmin,
} = require('../controllers/userController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All routes below are protected

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/addresses')
  .post(addAddress);

router.route('/addresses/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

router.route('/wishlist')
  .get(getWishlist)
  .post(addToWishlist);

router.route('/wishlist/:productId')
  .delete(removeFromWishlist);

// Admin-only user management routes
router.route('/')
  .get(authorize('admin'), getAllUsers);

router.route('/:id')
  .put(authorize('admin'), updateUserAdmin)
  .delete(authorize('admin'), deleteUserAdmin);

module.exports = router;
