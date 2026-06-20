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

    // Check duplicate email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new ErrorResponse('Email is already registered', 400));
    }

    // Check duplicate phone
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return next(new ErrorResponse('Phone number is already registered', 400));
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

    // Send verification email in the background (non-blocking for instant response)
    sendEmail({
      email: user.email,
      subject: 'Verify Your Email',
      name: user.firstName,
      otp
    }).catch((err) => {
      console.error('Error sending OTP email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'OTP has been sent to your email.'
    });
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

    // Block login if email is not verified
    if (!user.isEmailVerified) {
      return next(new ErrorResponse('Please verify your email before logging in.', 401));
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
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (user.isEmailVerified) {
      return next(new ErrorResponse('Email already verified', 400));
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP.'
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired.'
      });
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /v1/auth/resend-otp
// @access  Public
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('User not found with this email', 404));
    }

    if (user.isEmailVerified) {
      return next(new ErrorResponse('Email already verified', 400));
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // Send verification email in the background (non-blocking for instant response)
    sendEmail({
      email: user.email,
      subject: 'Verify Your Email',
      name: user.firstName,
      otp
    }).catch((err) => {
      console.error('Error sending OTP email:', err);
    });

    res.status(200).json({
      success: true,
      message: 'A new OTP has been sent.'
    });
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
