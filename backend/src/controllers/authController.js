const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');
const sendEmail = require('../services/emailService');
const crypto = require('crypto');
const generateOTP = require('../utils/generateOTP');

// Hash an OTP before storage so plaintext is never saved to DB
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
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

    // Generate OTP and hash it before storing
    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user — store hashed OTP, never plaintext
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || 'user',
      otp: hashOtp(otp),
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
// @desc    Log user out / clear cookie
// @route   POST /v1/auth/logout  (POST prevents CSRF-based forced logout)
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
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

    // Always return the same response to prevent user enumeration (bug #9)
    const genericMessage = 'If an account with that email exists, a reset link has been sent.';

    if (!user) {
      // Return 200 with generic message — do NOT expose whether email exists
      return sendResponse(res, 200, genericMessage);
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    // Create reset url — do NOT log this URL (token is sensitive)
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request — Zeelin Overseas',
        message: `You requested a password reset. Visit this link to set a new password (expires in 10 minutes): ${resetUrl}`
      });

      sendResponse(res, 200, genericMessage);
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

    // Check expiry first (avoids timing-leak ordering)
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }

    // Compare hashed OTP using constant-time comparison (bug #11)
    const hashedInput = crypto.createHash('sha256').update(otp).digest('hex');
    if (!user.otp || !crypto.timingSafeEqual(Buffer.from(user.otp), Buffer.from(hashedInput))) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
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

    // Store hashed OTP — never store plaintext (bug #11)
    user.otp = hashOtp(otp);
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
      return next(new ErrorResponse('Invalid or expired reset token', 400));
    }

    // Set new password and clear reset fields
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Do NOT auto-login after reset (bug #10) — force user to log in with new password
    sendResponse(res, 200, 'Password reset successful. Please log in with your new password.');
  } catch (error) {
    next(error);
  }
};
