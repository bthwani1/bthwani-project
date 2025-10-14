import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdempotencyMiddleware } from './common/middleware/idempotency.middleware';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { AppLoggerService } from './common/services/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { OrderModule } from './modules/order/order.module';
import { DriverModule } from './modules/driver/driver.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { StoreModule } from './modules/store/store.module';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';
import { FinanceModule } from './modules/finance/finance.module';
import { CartModule } from './modules/cart/cart.module';
import { UtilityModule } from './modules/utility/utility.module';
import { AkhdimniModule } from './modules/akhdimni/akhdimni.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { ContentModule } from './modules/content/content.module';
import { ERModule } from './modules/er/er.module';
import { GatewaysModule } from './gateways/gateways.module';
import { MarketerModule } from './modules/marketer/marketer.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { LegalModule } from './modules/legal/legal.module';
import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { QueuesModule } from './queues/queues.module';

// Import configurations
import databaseConfig from './config/database.config';
import cacheConfig from './config/cache.config';
import firebaseConfig from './config/firebase.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    // Configuration Module with Validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, cacheConfig, firebaseConfig, jwtConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true, // السماح بمتغيرات إضافية
        abortEarly: false, // عرض جميع الأخطاء مرة واحدة
      },
    }),

    // Database Module
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bthwani',
        retryWrites: true,
        w: 'majority',
      }),
    }),

    // Cache Module
    CacheModule.register({
      isGlobal: true,
      ttl: parseInt(process.env.CACHE_TTL || '600', 10),
      max: parseInt(process.env.CACHE_MAX_ITEMS || '100', 10),
    }),

    // Rate Limiting Module ✨
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 60 ثانية
        limit: 100, // 100 طلب في الدقيقة (افتراضي)
      },
      {
        name: 'strict',
        ttl: 60000, // 60 ثانية
        limit: 10, // 10 طلبات في الدقيقة (للعمليات الحساسة)
      },
      {
        name: 'auth',
        ttl: 60000, // 60 ثانية
        limit: 5, // 5 محاولات تسجيل دخول في الدقيقة
      },
    ]),

    // Feature Modules
    AuthModule,

    WalletModule,

    OrderModule,

    DriverModule,

    VendorModule,

    StoreModule,

    UserModule,

    NotificationModule,

    AdminModule,

    FinanceModule,

    CartModule,

    UtilityModule,

    AkhdimniModule,

    PromotionModule,

    MerchantModule,

    ContentModule,

    ERModule,

    MarketerModule,

    AnalyticsModule,

    LegalModule,

    // Health Check & Metrics
    HealthModule,
    MetricsModule,

    // Background Jobs & Queues
    QueuesModule,

    // WebSocket Gateways
    GatewaysModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IdempotencyMiddleware,
    CorrelationIdMiddleware,
    AppLoggerService,
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    // ✨ Global Rate Limiting Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware, IdempotencyMiddleware)
      .forRoutes('*'); // يطبق على جميع المسارات
  }
}
