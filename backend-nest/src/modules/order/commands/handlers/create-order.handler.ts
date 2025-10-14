import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CreateOrderCommand } from '../impl/create-order.command';
import { Order } from '../../entities/order.entity';
import { OrderStatus } from '../../enums/order-status.enum';
import { OrderCreatedEvent } from '../../events/impl/order-created.event';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    // 1. التحقق من صحة البيانات
    if (!command.items || command.items.length === 0) {
      throw new BadRequestException({
        code: 'NO_ITEMS',
        message: 'Order must have at least one item',
        userMessage: 'يجب أن يحتوي الطلب على منتج واحد على الأقل',
      });
    }

    // 2. إنشاء الطلب
    const order = await this.orderModel.create({
      user: new Types.ObjectId(command.userId),
      items: command.items.map((item) => ({
        ...item,
        productId: new Types.ObjectId(item.productId),
        store: new Types.ObjectId(item.store),
      })),
      address: command.address,
      paymentMethod: command.paymentMethod,
      price: command.price,
      deliveryFee: command.deliveryFee,
      companyShare: command.companyShare,
      platformShare: command.platformShare,
      walletUsed: command.walletUsed || 0,
      cashDue: command.price + command.deliveryFee - (command.walletUsed || 0),
      status: OrderStatus.CREATED,
      statusHistory: [
        {
          status: OrderStatus.CREATED,
          changedAt: new Date(),
          changedBy: 'customer',
        },
      ],
    });

    // 3. مسح cache
    await this.cacheManager.del(`orders:user:${command.userId}`);

    // 4. إصدار Event
    this.eventBus.publish(
      new OrderCreatedEvent(
        (order._id as any).toString(),
        command.userId,
        order.items,
        order.price,
      ),
    );

    return order;
  }
}

