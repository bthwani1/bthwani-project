import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { IdempotencyHeaderMiddleware } from './common/middleware/idempotency-header.middleware';
import { logger } from './config/logger.config';
import * as admin from 'firebase-admin';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Security Headers - Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      noSniff: true,
      xssFilter: true,
    }),
  );

  // Rate Limiting - حماية من هجمات DDoS
  const rateLimitTTL = parseInt(process.env.RATE_LIMIT_TTL || '60', 10); // seconds
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX || '100', 10); // requests

  app.use(
    rateLimit({
      windowMs: rateLimitTTL * 1000, // تحويل إلى milliseconds
      max: rateLimitMax, // عدد الطلبات المسموحة
      message: {
        statusCode: 429,
        message: 'Too many requests from this IP',
        userMessage: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
        error: 'Too Many Requests',
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      skip: (req) => {
        // تجاهل health checks من rate limiting
        return req.path === '/health' || req.path.startsWith('/health/');
      },
      handler: (req, res) => {
        const appLogger = logger;
        appLogger.warn(
          `Rate limit exceeded for IP: ${req.ip} - Path: ${req.path}`,
          'RateLimiter',
        );
        res.status(429).json({
          statusCode: 429,
          message: 'Too many requests',
          userMessage: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
          error: 'Too Many Requests',
        });
      },
    }),
  );

  // Idempotency Header Middleware - لاستخراج Idempotency-Key من headers
  app.use(new IdempotencyHeaderMiddleware().use);

  // Security & CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  });

  // Firebase Admin Initialization
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters & Interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(30000), // 30 seconds timeout
    new PerformanceInterceptor(null), // Performance tracking
  );

  // API Versioning Strategy
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
    prefix: 'api/v',
  });

  // API Prefix (for non-versioned routes like /health, /docs)
  app.setGlobalPrefix('api', {
    exclude: ['health', 'health/*path', 'api/docs*path'],
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Bthwani API v2')
    .setDescription('NestJS API Documentation - نظام إدارة الطلبات والتجارة')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth', 'المصادقة وتسجيل الدخول')
    .addTag('User', 'إدارة المستخدمين')
    .addTag('Wallet', 'المحفظة والمعاملات المالية')
    .addTag('Order', 'إدارة الطلبات')
    .addTag('Driver', 'عمليات السائقين')
    .addTag('Vendor', 'إدارة التجار')
    .addTag('Store', 'المتاجر والمنتجات')
    .addTag('Finance', 'المحاسبة والتقارير المالية')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // استخدام Logger بدلاً من console.log
  logger.log(
    `🚀 Application running on: http://localhost:${port}`,
    'Bootstrap',
  );
  logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`, 'Bootstrap');
  logger.log(
    `🔥 Environment: ${process.env.NODE_ENV || 'development'}`,
    'Bootstrap',
  );
  logger.log(
    `📊 Log Level: ${process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')}`,
    'Bootstrap',
  );
}

void bootstrap();
