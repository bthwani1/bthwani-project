import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * Idempotency Middleware
 * يمنع تكرار العمليات الحساسة مثل الدفع والطلبات
 * يستخدم مفتاح Idempotency-Key في الـ headers
 */
@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  // Cache في الذاكرة للسرعة (يمكن استبداله بـ Redis في Production)
  private readonly cache = new Map<
    string,
    { status: number; response: any; timestamp: number }
  >();

  // مدة صلاحية المفتاح: 24 ساعة
  private readonly TTL = 24 * 60 * 60 * 1000;

  constructor(@InjectConnection() private readonly connection: Connection) {
    // تنظيف المفاتيح القديمة كل ساعة
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  use(req: Request, res: Response, next: NextFunction) {
    // فقط للعمليات POST/PUT/PATCH
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return next();
    }

    // فقط للمسارات الحساسة
    const sensitiveRoutes = [
      '/wallet/transaction',
      '/wallet/topup',
      '/wallet/transfer',
      '/order',
      '/payment',
      '/finance/payout',
      '/finance/settlement',
    ];

    const isSensitiveRoute = sensitiveRoutes.some((route) =>
      req.path.includes(route),
    );

    if (!isSensitiveRoute) {
      return next();
    }

    const idempotencyKey = req.headers['idempotency-key'] as string;

    if (!idempotencyKey) {
      // مفتاح Idempotency مطلوب للعمليات الحساسة
      return res.status(400).json({
        statusCode: 400,
        message: 'Idempotency-Key header is required',
        userMessage: 'مفتاح Idempotency مطلوب لهذه العملية',
        error: 'Bad Request',
      });
    }

    // التحقق من وجود المفتاح في Cache
    const cached = this.cache.get(idempotencyKey);

    if (cached) {
      // إذا كانت العملية مكتملة، إرجاع النتيجة السابقة
      return res.status(cached.status).json(cached.response);
    }

    // حفظ الاستجابة الأصلية
    const originalJson = res.json.bind(res) as Response['json'];
    const originalStatus = res.status.bind(res) as Response['status'];
    let statusCode = 200;

    // Override status
    res.status = function (code: number) {
      statusCode = code;
      return originalStatus(code);
    };

    // Override json
    res.json = (body: unknown) => {
      // حفظ في Cache فقط للنجاح (2xx)
      if (statusCode >= 200 && statusCode < 300) {
        this.cache.set(idempotencyKey, {
          status: statusCode,
          response: body,
          timestamp: Date.now(),
        });
      }
      return originalJson(body);
    };

    next();
  }

  /**
   * تنظيف المفاتيح القديمة
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}
