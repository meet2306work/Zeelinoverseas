const { check, validationResult } = require('express-validator');
const sendResponse = require('../utils/responseFormatter');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // err.path is the v7+ field; fall back to err.param for v6 compatibility (bug #12)
  errors.array().map(err => extractedErrors.push({ [err.path || err.param]: err.msg }));

  return res.status(400).json({
    success: false,
    message: 'Validation errors',
    data: null,
    pagination: null,
    errors: extractedErrors,
    statusCode: 400
  });
};

exports.registerValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate
];

exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validate
];

exports.forgotPasswordValidation = [
  check('email', 'Please include a valid email').isEmail(),
  validate
];

exports.resetPasswordValidation = [
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  validate
];

exports.verifyEmailValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('otp', 'OTP must be 6 digits').isLength({ min: 6, max: 6 }),
  validate
];

exports.resendOtpValidation = [
  check('email', 'Please include a valid email').isEmail(),
  validate
];
