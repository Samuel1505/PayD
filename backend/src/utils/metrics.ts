import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

export const register = new Registry();

register.setDefaultLabels({
  app: 'payd-backend',
  env: process.env.NODE_ENV || 'development',
});

// Collect default Node.js metrics (memory, CPU, event loop lag, GC, etc.)
collectDefaultMetrics({ register });

// ─── HTTP Metrics ────────────────────────────────────────────────────────────

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestErrors = new Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP requests that resulted in an error (4xx/5xx)',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Current number of active HTTP connections',
  registers: [register],
});

// ─── Database Metrics ────────────────────────────────────────────────────────

export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of PostgreSQL queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [register],
});

export const dbConnectionPool = new Gauge({
  name: 'db_connection_pool_size',
  help: 'Current number of database connections in the pool',
  labelNames: ['state'], // 'idle' | 'waiting' | 'total'
  registers: [register],
});

// ─── Business / Domain Metrics ───────────────────────────────────────────────

export const paymentOperations = new Counter({
  name: 'payment_operations_total',
  help: 'Total number of payment operations processed',
  labelNames: ['status', 'type'], // status: success|failed|pending, type: payroll|bonus|transfer
  registers: [register],
});

export const payrollJobDuration = new Histogram({
  name: 'payroll_job_duration_seconds',
  help: 'Duration of payroll processing jobs in seconds',
  labelNames: ['status'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10, 30, 60],
  registers: [register],
});

export const authAttempts = new Counter({
  name: 'auth_attempts_total',
  help: 'Total authentication attempts',
  labelNames: ['method', 'status'], // method: jwt|google|github, status: success|failure
  registers: [register],
});

export const stellarApiDuration = new Histogram({
  name: 'stellar_api_duration_seconds',
  help: 'Duration of Stellar Horizon/SDS API calls in seconds',
  labelNames: ['operation', 'status'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const errorTotal = new Counter({
  name: 'errors_total',
  help: 'Total number of application errors',
  labelNames: ['type', 'route'],
  registers: [register],
});

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Wrap an async fn and record its duration + status in `dbQueryDuration`.
 * Usage: await timeDbQuery('select', 'employees', () => pool.query(...))
 */
export async function timeDbQuery<T>(
  operation: string,
  table: string,
  fn: () => Promise<T>,
): Promise<T> {
  const end = dbQueryDuration.startTimer({ operation, table });
  try {
    const result = await fn();
    end();
    return result;
  } catch (err) {
    end();
    throw err;
  }
}
