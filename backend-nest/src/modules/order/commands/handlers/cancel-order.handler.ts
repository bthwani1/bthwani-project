import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CancelOrderCommand } from '../impl/cancel-order.command';
import { Order } from '../../entities/order.entity';
import { OrderStatus } from '../../enums/order-status.enum';
import { OrderCancelledEvent } from '../../events/impl/order-cancelled.event';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventBus: EventBus,
  ) {}

  async execute(command: CancelOrderCommand): Promise<Order> {
    const order = await this.orderModel.findById(command.orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    // التحقق من الصلاحية
    if (command.userId && order.user.toString() !== command.userId) {
      throw new BadRequestException({
        code: 'NOT_YOUR_ORDER',
        message: 'This is not your order',
        userMessage: 'هذا ليس طلبك',
      });
    }

    // التحقق من إمكانية الإلغاء
    if (
      ![OrderStatus.CREATED, OrderStatus.CONFIRMED, OrderStatus.PREPARING].includes(
        order.status as OrderStatus,
      )
    ) {
      throw new BadRequestException({
        code: 'CANNOT_CANCEL',
        message: 'Order cannot be cancelled at this stage',
        userMessage: 'لا يمكن إلغاء الطلب في هذه المرحلة',
      });
    }

    // إلغاء الطلب
    order.status = OrderStatus.CANCELLED;
    order.cancelReason = command.reason;
    order.canceledBy = command.canceledBy;
    order.canceledAt = new Date();

    order.statusHistory.push({
      status: OrderStatus.CANCELLED,
      changedAt: new Date(),
      changedBy: command.canceledBy,
      reason: command.reason,
    } as any);

    await order.save();

    // مسح cache
    await this.cacheManager.del(`order:${command.orderId}`);
    await this.cacheManager.del(`orders:user:${order.user.toString()}`);

    // إصدار Event
    this.eventBus.publish(
      new OrderCancelledEvent(
        (order._id as any).toString(),
        order.user.toString(),
        command.reason,
        command.canceledBy,
      ),
    );

    return order;
  }
}

