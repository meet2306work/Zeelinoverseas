const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyEmail,
  resendOtp,
  resetPassword
} = require('../controllers/authController');

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
  resendOtpValidation
} = require('../validators/authValidator');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Rate limiting for resending OTP to prevent abuse:
// 1. Allow only 1 request every 60 seconds
const resendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Please wait 60 seconds before requesting another OTP.'
  }
});

// 2. Allow maximum 5 resend attempts within 1 hour
const resendMaxLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Maximum resend attempts reached. Please try again after an hour.'
  }
});

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout); // POST prevents CSRF-based forced logout
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, resetPassword); // validator was missing (bug #17)
router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/resend-otp', resendOtpValidation, resendLimiter, resendMaxLimiter, resendOtp);

module.exports = router;
