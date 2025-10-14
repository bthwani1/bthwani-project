import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderGateway } from './order.gateway';
import { DriverGateway } from './driver.gateway';
import { NotificationGateway } from './notification.gateway';
import { Order, OrderSchema } from '../modules/order/entities/order.entity';

@Module({
  imports: [
    // JWT Module للمصادقة
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: (configService.get<string>('jwt.expiresIn') || '7d') as any,
        },
      }),
      inject: [ConfigService],
    }),
    // Mongoose Module للوصول للـ Order model
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrderGateway, DriverGateway, NotificationGateway],
  exports: [OrderGateway, DriverGateway, NotificationGateway],
})
export class GatewaysModule {}

