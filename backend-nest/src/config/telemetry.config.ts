/**
 * BTW-OBS-004: OpenTelemetry Configuration
 */

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis-4';

export function setupTelemetry() {
  // Only enable in production or when explicitly enabled
  if (process.env.ENABLE_TELEMETRY !== 'true') {
    console.log('📊 Telemetry disabled (set ENABLE_TELEMETRY=true to enable)');
    return;
  }

  const serviceName = process.env.SERVICE_NAME || 'bthwani-backend';
  const environment = process.env.NODE_ENV || 'development';
  const version = process.env.APP_VERSION || '1.0.0';

  // Create resource with service information
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: version,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  });

  // Create tracer provider
  const provider = new NodeTracerProvider({
    resource,
  });

  // Configure OTLP exporter
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces';
  const exporter = new OTLPTraceExporter({
    url: otlpEndpoint,
  });

  // Add batch span processor
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  // Register provider
  provider.register();

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new MongoDBInstrumentation({
        enhancedDatabaseReporting: true,
      }),
      new RedisInstrumentation(),
    ],
  });

  console.log(`✅ OpenTelemetry initialized for ${serviceName} (${environment})`);
  console.log(`📡 Exporting to: ${otlpEndpoint}`);
}

