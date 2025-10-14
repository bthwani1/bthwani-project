import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SuppressionService } from './services/suppression.service';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import {
  NotificationSuppression,
  NotificationSuppressionSchema,
} from './entities/suppression.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationSuppression.name, schema: NotificationSuppressionSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, SuppressionService],
  exports: [NotificationService, SuppressionService],
})
export class NotificationModule {}
