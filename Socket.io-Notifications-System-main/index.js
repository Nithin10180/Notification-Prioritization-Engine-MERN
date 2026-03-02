import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { registerApi } from "./routes/index.js";
import { globalErrorMiddleware } from "./middlewares/index.js";

import { ALLOWED_ORIGINS } from "./constants/index.js";
import { registerNotificationSocket } from "./socket.io/notification.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Basic app configuration
app.use(express.json());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.set("trust proxy", true);
app.use(express.static("public"));

// Shared health / telemetry state (can be updated from other modules later)
app.set("aiCircuitState", "closed"); // closed | open | half_open
app.set("aiLastFailureAt", null);
app.set("queueSize", 0);

const port = process.env.PORT || 3000;

// API routes and global error handler
registerApi(app);
app.use(globalErrorMiddleware);

// Health endpoint with structured JSON
app.get("/api/health", (req, res) => {
  const aiCircuitState = req.app.get("aiCircuitState") || "unknown";
  const aiLastFailureAt = req.app.get("aiLastFailureAt") || null;
  const queueSize = req.app.get("queueSize") || 0;

  const dbReadyState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: {
      status: dbReadyState === 1 ? "up" : "down",
      readyState: dbReadyState,
    },
    aiCircuit: {
      state: aiCircuitState,
      lastFailureAt: aiLastFailureAt,
    },
    queue: {
      size: queueSize,
    },
  });
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);
registerNotificationSocket(io);

// MongoDB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Start server
server.listen(port, () => {
  console.log(`${process.env.ENVIRONMENT} server is running on port ${port}`);
});