import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from 'http';
import authRoutes from "./routes/authRoutes.js";
import retailerRoutes from "./routes/retailerRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { initializeSocket } from './config/socket.js';
import { pool } from "./config/db.js";

dotenv.config();

const app = express();

// CORS configuration - allow your frontend origin
const corsOptions = {
  origin: [
    'https://bailord-pulse.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes - mounted at /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/retailers", retailerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);

// Also mount auth routes without /api prefix for backwards compatibility
app.use("/auth", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
