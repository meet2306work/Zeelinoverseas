const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

require("dotenv").config();

const app = express();

// ============================
// Security
// ============================

app.use(helmet());

// ============================
// CORS
// ============================

const allowedOrigins = [
  "https://zeelinoverseas.com",
  "https://store.zeelinoverseas.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / Mobile Apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================
// Rate Limiter
// ============================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/v1", apiLimiter);

// ============================
// Compression
// ============================

app.use(compression());

// ============================
// Body Parser
// ============================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================
// Cookie Parser
// ============================

app.use(cookieParser());

// ============================
// Logger
// ============================

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ============================
// Static Files
// ============================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================
// Health Check
// ============================

app.get("/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zeelinoverseas API is running.",
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

// ============================
// API Routes
// ============================

const routes = require("./src/routes");
app.use("/v1", routes);

// ============================
// 404
// ============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================
// Global Error Handler
// ============================

const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;