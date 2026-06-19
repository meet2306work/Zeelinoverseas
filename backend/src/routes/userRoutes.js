const express = require('express');
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/userController');

const { protect } = require('../middlewares/auth');

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

module.exports = router;
