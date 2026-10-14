import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB, isDbConnected } from './config/db.js';
import { demoRouter } from './routes/demoRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalApiLimiter } from './middleware/rateLimiter.js';
import { startEmailRetryWorker } from './services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const isProd = process.env.NODE_ENV === 'production';

// Connect to MongoDB Atlas (skip auto-connect during tests)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  // Start background email notification retry worker (every 2 minutes)
  startEmailRetryWorker(2 * 60 * 1000);
}

// Trust proxy for Render / load balancers (ensures accurate rate limiting by IP)
app.set('trust proxy', 1);

// Security & Strict CORS setup (Requirement 4)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5178,http://localhost:5001')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. same-origin in production, mobile apps, curl)
      if (!origin) return callback(null, true);

      // In development, allow localhost origins
      if (!isProd && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-internal-admin-key'],
    credentials: true,
  })
);

// Payload size limit for spam and DoS protection
app.use(express.json({ limit: '10kb' }));

// Health Check Endpoint
app.get('/api/health', generalApiLimiter, (req, res) => {
  const dbConnected = isDbConnected();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'healthy' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount Demo Routes
app.use('/api', demoRouter);

// Serve static frontend in production (Single-Service Render Deployment)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Handle 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.path} not found.`,
  });
});

// Error Handling Middleware
app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`[Elevra Server] Running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

// Graceful Shutdown
const handleShutdown = (signal) => {
  console.log(`[Elevra Server] Received ${signal}. Closing gracefully...`);
  if (server) {
    server.close(() => {
      console.log('[Elevra Server] HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export { app, server };
export default app;
