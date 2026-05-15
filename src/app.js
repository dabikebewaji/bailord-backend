import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import retailerRoutes from "./routes/retailerRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { pool } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const express = require('express');
const cors = require('cors');
const app = express();

// This middleware automatically handles the 'OPTIONS' preflight for you
app.use(cors({
  origin: 'https://bailord-pulse.vercel.app', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Your routes go below this
app.post('/auth/login', (req, res) => {
  // ... login logic
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/retailers", retailerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);

// Start server
const PORT = process.env.PORT || 5000;

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${startPort} is in use, trying next port...`);
        // Ensure we add numbers, not concatenate strings
        resolve(findAvailablePort(parseInt(startPort) + 1));
      } else {
        reject(err);
      }
    });
  });
};

// Create HTTP server
import { createServer } from 'http';
import { initializeSocket } from './config/socket.js';

const httpServer = createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Make io available globally
app.set('io', io);

// Start server with automatic port finding
findAvailablePort(PORT).then((availablePort) => {
  httpServer.listen(availablePort, () => {
    console.log(`🚀 Server running on port ${availablePort}`);
    console.log(`🔌 WebSocket server ready at ws://localhost:${availablePort}/ws`);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
});

export default app;
