import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationProcessor } from './processors/notification.processor';
import { EmailProcessor } from './processors/email.processor';
import { OrderProcessor } from './processors/order.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          attempts: 5,                    // ✅ زيادة المحاولات من 3 إلى 5
          backoff: {
            type: 'exponential',
            delay: 2000,                  // ✅ البدء بـ 2 ثانية بدلاً من 1
          },
          removeOnComplete: 100,
          removeOnFail: false,            // ✅ الاحتفاظ بالفاشلة للتحليل
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'notifications' },
      { name: 'notifications-dlq' },      // ✅ Dead Letter Queue للإشعارات الفاشلة
      { name: 'emails' },
      { name: 'emails-dlq' },             // ✅ Dead Letter Queue للبريد الفاشل
      { name: 'orders' },
      { name: 'orders-dlq' },             // ✅ Dead Letter Queue للطلبات الفاشلة
      { name: 'reports' },
    ),
  ],
  providers: [NotificationProcessor, EmailProcessor, OrderProcessor],
  exports: [BullModule],
})
export class QueuesModule {}

