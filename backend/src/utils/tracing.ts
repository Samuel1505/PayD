import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import type { SpanProcessor } from '@opentelemetry/sdk-trace-base';

const serviceName = 'payd-backend';
const serviceVersion = process.env.npm_package_version ?? '1.0.0';
const otlpEndpoint =
  process.env.OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces';
const tracingEnabled = process.env.TRACING_ENABLED === 'true';
const isDev = process.env.NODE_ENV !== 'production';

let sdk: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry distributed tracing.
 *
 * In development the SDK prints spans to stdout (ConsoleSpanExporter).
 * In production (or when OTLP_ENDPOINT is set) spans are exported via OTLP/HTTP
 * to Jaeger (or any compatible collector such as the OpenTelemetry Collector).
 *
 * Call this function BEFORE importing express / pg to ensure auto-instrumentation
 * patches the libraries correctly.
 */
export function initTracing(): void {
  if (!tracingEnabled) {
    return;
  }

  const spanProcessor: SpanProcessor = isDev
    ? new SimpleSpanProcessor(new ConsoleSpanExporter())
    : new BatchSpanProcessor(
        new OTLPTraceExporter({ url: otlpEndpoint }),
        {
          maxQueueSize: 1000,
          maxExportBatchSize: 100,
          scheduledDelayMillis: 500,
        },
      );

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion,
      'deployment.environment': process.env.NODE_ENV ?? 'development',
    }),
    spanProcessors: [spanProcessor],
    instrumentations: [
      new HttpInstrumentation({
        // Strip health/metrics endpoints from traces to reduce noise
        ignoreIncomingRequestHook: (req) => {
          const url = req.url ?? '';
          return url === '/health' || url === '/metrics';
        },
      }),
      new ExpressInstrumentation(),
      new PgInstrumentation({ enhancedDatabaseReporting: true }),
    ],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      ?.shutdown()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });

  process.on('SIGINT', () => {
    sdk
      ?.shutdown()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
}

export { sdk };
