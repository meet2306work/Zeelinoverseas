require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./src/database/connection");

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Allowed Origins
const allowedOrigins = [
  "https://store.zeelinoverseas.com",
  "https://zeelinoverseas.com",
  "http://localhost:5173",
];

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

app.set("io", io);

// Socket Connection
io.on("connection", (socket) => {
  console.log(`✅ Socket Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Socket Disconnected: ${socket.id}`);
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("======================================");
      console.log(`🚀 Server Running on Port ${PORT}`);
      console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
      console.log("======================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION");
  console.error(err);
  process.exit(1);
});

// Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION");
  console.error(err);

  server.close(() => {
    process.exit(1);
  });
});

startServer();