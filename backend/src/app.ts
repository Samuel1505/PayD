import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import logger from './utils/logger.js';
import { requestLogger, errorLogger } from './middleware/requestLogger.js';
import metricsRoutes from './routes/metricsRoutes.js';
import payrollRoutes from './routes/payroll.routes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors());
// Structured JSON request logging + Prometheus metrics (replaces morgan)
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Observability Endpoints ─────────────────────────────────────────────────

// Health check — used by Docker / load-balancer probes
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version ?? '1.0.0',
  });
});

// Prometheus metrics — scraped by Prometheus every 15 s
app.use('/metrics', metricsRoutes);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/search', searchRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
// errorLogger must come before the final error responder so it can log + count
app.use(errorLogger);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : 'An error occurred',
  });
});

export default app;
