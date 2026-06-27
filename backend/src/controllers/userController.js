const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Get user profile
// @route   GET /v1/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    sendResponse(res, 200, 'Profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // Validate avatar URL before accepting it (bug #6)
    // Only accept null/empty or a valid Cloudinary URL
    if (req.body.avatar && req.body.avatar !== null) {
      const avatarUrl = req.body.avatar;
      const isValidCloudinaryUrl = /^https:\/\/res\.cloudinary\.com\/[^/]+\/.+/.test(avatarUrl);
      if (!isValidCloudinaryUrl) {
        return next(new ErrorResponse('Invalid avatar URL: only Cloudinary URLs are accepted', 400));
      }
    }

    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      companyName: req.body.companyName,
      registrationNo: req.body.registrationNo,
      prefPort: req.body.prefPort,
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
      avatar: req.body.avatar
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    sendResponse(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Add address
// @route   POST /v1/users/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    await user.save();

    sendResponse(res, 201, 'Address added successfully', user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /v1/users/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      address[key] = req.body[key];
    });

    await user.save();
    sendResponse(res, 200, 'Address updated successfully', user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /v1/users/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.pull(req.params.addressId);
    await user.save();

    sendResponse(res, 200, 'Address deleted successfully', user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /v1/users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'title price images moq specifications description averageRating ratingsCount'
    });
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    sendResponse(res, 200, 'Wishlist fetched successfully', user.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /v1/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return next(new ErrorResponse('Product ID is required', 400));
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    if (user.wishlist.includes(productId)) {
      const populatedUser = await User.findById(req.user.id).populate({
        path: 'wishlist',
        select: 'title price images moq specifications description averageRating ratingsCount'
      });
      return sendResponse(res, 200, 'Product already in wishlist', populatedUser.wishlist);
    }
    user.wishlist.push(productId);
    await user.save();
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'title price images moq specifications description averageRating ratingsCount'
    });
    sendResponse(res, 200, 'Product added to wishlist', populatedUser.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /v1/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'title price images moq specifications description averageRating ratingsCount'
    });
    sendResponse(res, 200, 'Product removed from wishlist', populatedUser.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /v1/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    sendResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status/role (Admin only)
// @route   PUT /v1/users/:id
// @access  Private/Admin
exports.updateUserAdmin = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Prevent an admin from modifying their own role/status via this endpoint (bug #4)
    if (req.params.id === req.user.id) {
      return next(new ErrorResponse('You cannot modify your own account via admin controls', 400));
    }

    // Whitelist allowed role values
    const allowedRoles = ['user', 'vendor', 'admin'];
    if (role && !allowedRoles.includes(role)) {
      return next(new ErrorResponse(`Invalid role: ${role}`, 400));
    }

    const allowedStatuses = ['active', 'inactive', 'suspended'];
    if (status && !allowedStatuses.includes(status)) {
      return next(new ErrorResponse(`Invalid status: ${status}`, 400));
    }

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    sendResponse(res, 200, 'User updated successfully', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /v1/users/:id
// @access  Private/Admin
exports.deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Do not allow deleting yourself
    if (user.id.toString() === req.user.id.toString()) {
      return next(new ErrorResponse('You cannot delete your own administrative account', 400));
    }

    await User.findByIdAndDelete(req.params.id);

    sendResponse(res, 200, 'User deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
