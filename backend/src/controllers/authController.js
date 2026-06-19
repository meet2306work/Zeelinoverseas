const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');
const sendEmail = require('../services/emailService');
const crypto = require('crypto');
const generateOTP = require('../utils/generateOTP');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    data: { user, token },
    pagination: null,
    errors: null,
    statusCode
  });
};

// @desc    Register user
// @route   POST /v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('Email is already registered', 400));
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || 'user',
      otp,
      otpExpire
    });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification OTP',
        message: `Welcome to Zeelinoverseas! Your OTP for email verification is ${otp}. It will expire in 10 minutes.`
      });
    } catch (err) {
      console.log('Error sending OTP email:', err);
    }

    sendTokenResponse(user, 201, res, 'Registration successful. Please verify your email with the OTP sent to you.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    if (user.status !== 'active') {
      return next(new ErrorResponse('Account is inactive or suspended.', 403));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    sendResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    sendResponse(res, 200, 'User profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Generate token (simple random hex for now, could be a 6 digit OTP)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      sendResponse(res, 200, 'Email sent');
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email with OTP
// @route   POST /v1/auth/verify-email
// @access  Private
exports.verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (user.isEmailVerified) {
      return next(new ErrorResponse('Email already verified', 400));
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    sendResponse(res, 200, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /v1/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};
