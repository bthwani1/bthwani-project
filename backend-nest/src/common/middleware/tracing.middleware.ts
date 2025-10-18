/**
 * BTW-OBS-004: OpenTelemetry Tracing Middleware
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Record request
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // Log request metrics
      const logData = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
        userAgent: req.get('user-agent'),
        ip: req.ip,
      };

      // In production, send to OpenTelemetry
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to OTEL collector
      }

      // Log for now
      if (res.statusCode >= 500) {
        console.error('Server Error:', logData);
      } else if (duration > 2000) {
        console.warn('Slow Request:', logData);
      }
    });

    next();
  }
}

