const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

const getTokenFromRequest = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }

  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
};

// Protect routes
exports.protect = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id role status');

    if (!user) {
      return next(new ErrorResponse('The user belonging to this token no longer exists.', 401));
    }

    if (user.status !== 'active') {
      return next(new ErrorResponse('Your account is currently inactive or suspended.', 403));
    }

    req.user = user;
    req.user.id = user._id.toString();

    next();
  } catch {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

exports.optionalProtect = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id role status');

    if (user && user.status === 'active') {
      req.user = user;
      req.user.id = user._id.toString();
    }
  } catch {
    // Optional auth should not block public catalog/RFQ routes.
  }

  next();
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};
