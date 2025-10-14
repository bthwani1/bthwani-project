import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { OrderController } from './order.controller';
import { OrderCqrsController } from './order-cqrs.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './entities/order.entity';
import { GatewaysModule } from '../../gateways/gateways.module';

// CQRS - Commands & Queries
import { OrderCommandHandlers } from './commands/handlers';
import { OrderQueryHandlers } from './queries/handlers';
import { OrderEventHandlers } from './events/handlers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CqrsModule, // ⚡ CQRS Support
    GatewaysModule, // للـ WebSocket events
    JwtModule.register({}),
  ],
  controllers: [
    OrderController, // Traditional REST
    OrderCqrsController, // CQRS-based (للعمليات المعقدة)
  ],
  providers: [
    OrderService,
    // CQRS Handlers
    ...OrderCommandHandlers,
    ...OrderQueryHandlers,
    ...OrderEventHandlers,
  ],
  exports: [OrderService],
})
export class OrderModule {}
