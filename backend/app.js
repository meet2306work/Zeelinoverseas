const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// --- Global Middleware ---

// Security Headers
app.use(helmet());

// CORS configuration (allow requests from frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
}));

// Rate Limiting (prevent brute-force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/v1/', apiLimiter);

// Payload Compression (reduce response size)
app.use(compression());

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser
app.use(cookieParser());

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static upload files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
// Placeholder for base route
app.get('/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Zeelinoverseas API is running optimally.',
    data: null,
    pagination: null,
    errors: null,
    statusCode: 200
  });
});

// Import and use routes here (Step 12)
const routes = require('./src/routes');
app.use('/v1', routes);

// --- 404 Handler ---
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    data: null,
    pagination: null,
    errors: 'RouteNotFound',
    statusCode: 404
  });
});

// --- Global Error Handler (Step 10) ---
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
