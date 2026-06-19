const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyEmail,
  resetPassword
} = require('../controllers/authController');

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation
} = require('../validators/authValidator');

const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/verify-email', protect, verifyEmail);

module.exports = router;
