import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';
// ElasticsearchTransport's client type lags behind @elastic/elasticsearch v8;
// cast via unknown to avoid declaration-file version conflicts.
type EsClientCompat = Parameters<typeof ElasticsearchTransport>[0]['client'];

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');
const esEnabled = process.env.ELASTICSEARCH_ENABLED === 'true';
const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

// Console format: colorized for dev, JSON for prod
const consoleFormat = isProduction
  ? combine(timestamp(), errors({ stack: true }), json())
  : combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      printf(({ timestamp: ts, level, message, service, traceId, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        const traceStr = traceId ? ` [trace:${traceId}]` : '';
        return `[${ts}] [${level}]${traceStr} ${message}${metaStr}`;
      }),
    );

const transports: winston.transport[] = [
  new winston.transports.Console({ format: consoleFormat }),
  // Persist all logs to file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: combine(timestamp(), errors({ stack: true }), json()),
    maxsize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: combine(timestamp(), errors({ stack: true }), json()),
    maxsize: 20 * 1024 * 1024, // 20 MB
    maxFiles: 10,
  }),
];

// Elasticsearch transport — added when ELASTICSEARCH_ENABLED=true
if (esEnabled) {
  const esClient = new Client({ node: esUrl });
  const esTransport = new ElasticsearchTransport({
    level: 'info',
    client: esClient as unknown as EsClientCompat,
    indexPrefix: 'payd-logs',
    indexSuffixPattern: 'YYYY.MM.DD',
    transformer: (logData: winston.Logform.TransformableInfo) => ({
      '@timestamp': new Date().toISOString(),
      severity: logData.level,
      message: logData.message,
      service: 'payd-backend',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      ...(typeof logData.meta === 'object' && logData.meta !== null ? logData.meta : {}),
    }),
  });

  esTransport.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Elasticsearch transport error:', err.message);
  });

  transports.push(esTransport);
}

const winstonLogger = winston.createLogger({
  level: logLevel,
  defaultMeta: { service: 'payd-backend' },
  transports,
  // Prevent winston from crashing on unhandled rejections
  exitOnError: false,
});

/**
 * Logger maintains backward-compatible interface with the original Logger class
 * while adding structured JSON output and Elasticsearch shipping.
 */
export class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, data?: Record<string, unknown>): void {
    winstonLogger.debug(message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    winstonLogger.info(message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    winstonLogger.warn(message, data);
  }

  error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      winstonLogger.error(message, { error: error.message, stack: error.stack });
    } else {
      winstonLogger.error(message, { error });
    }
  }

  /** Attach a trace/span ID to all subsequent log entries in a request context. */
  child(meta: Record<string, unknown>): winston.Logger {
    return winstonLogger.child(meta);
  }
}

export { winstonLogger };
export default Logger.getInstance();
