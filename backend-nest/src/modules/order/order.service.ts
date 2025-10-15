import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { BulkOperationsUtil } from '../../common/utils/bulk-operations.util';
import {
  PaginationHelper,
  EntityHelper,
  CacheHelper,
} from '../../common/utils';

@Injectable()
export class OrderService {
  // Cache TTL (Time To Live)
  private readonly ORDER_CACHE_TTL = 300; // 5 دقائق
  private readonly ORDERS_LIST_CACHE_TTL = 60; // 1 دقيقة

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // إنشاء طلب جديد
  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderModel.create({
      ...createOrderDto,
      user: new Types.ObjectId(createOrderDto.user),
      items: createOrderDto.items.map((item) => ({
        ...item,
        productId: new Types.ObjectId(item.productId),
        store: new Types.ObjectId(item.store),
      })),
      status: OrderStatus.CREATED,
      statusHistory: [
        {
          status: OrderStatus.CREATED,
          changedAt: new Date(),
          changedBy: 'customer',
        },
      ],
    });

    // ⚡ مسح cache قائمة الطلبات للمستخدم (أضيف طلب جديد)
    await this.invalidateUserOrdersCache(createOrderDto.user);

    return order;
  }

  // جلب طلبات المستخدم مع Cursor Pagination
  async findUserOrders(userId: string, pagination: CursorPaginationDto) {
    return PaginationHelper.paginate(
      this.orderModel,
      { user: new Types.ObjectId(userId) },
      pagination,
      {
        populate: { path: 'driver', select: 'fullName phone profileImage' },
      },
    );
  }

  // جلب طلبات التاجر
  async findVendorOrders(vendorId: string, pagination: CursorPaginationDto) {
    return PaginationHelper.paginate(
      this.orderModel,
      { vendor: new Types.ObjectId(vendorId) },
      pagination,
      {
        populate: [
          { path: 'user', select: 'fullName phone' },
          { path: 'driver', select: 'fullName phone profileImage' },
        ] as any,
      },
    );
  }

  // جلب جميع الطلبات (للإدارة)
  async findAll(pagination: CursorPaginationDto) {
    return PaginationHelper.paginate(this.orderModel, {}, pagination, {
      populate: [
        { path: 'user', select: 'fullName phone' } as any,
        { path: 'driver', select: 'fullName phone' } as any,
      ],
    });
  }

  // جلب طلب محدد (مع Cache)
  async findOne(id: string) {
    return CacheHelper.getOrSet(
      this.cacheManager,
      `order:${id}`,
      this.ORDER_CACHE_TTL,
      async () => {
        const order = await EntityHelper.findByIdOrFail(
          this.orderModel,
          id,
          'Order',
          {
            populate: [
              {
                path: 'user',
                select: 'fullName phone email profileImage',
              } as any,
              { path: 'driver', select: 'fullName phone profileImage' } as any,
            ],
            lean: true,
          },
        );
        return order;
      },
    );
  }

  /**
   * مسح cache الطلب (عند التحديث)
   */
  private async invalidateOrderCache(orderId: string) {
    await CacheHelper.forget(this.cacheManager, `order:${orderId}`);
  }

  /**
   * مسح cache قائمة الطلبات لمستخدم
   */
  private async invalidateUserOrdersCache(userId: string) {
    await CacheHelper.forget(this.cacheManager, `orders:user:${userId}`);
  }

  // تحديث حالة الطلب
  async updateStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    // إضافة السجل لتاريخ الحالات
    order.statusHistory.push({
      status: updateStatusDto.status as OrderStatus,
      changedAt: new Date(),
      changedBy: updateStatusDto.changedBy || 'admin',
    });

    // تحديث الحالة
    order.status = updateStatusDto.status as OrderStatus;

    // إضافة سبب الإلغاء إذا كان ملغى
    if (
      (updateStatusDto.status as OrderStatus) === OrderStatus.CANCELLED &&
      updateStatusDto.reason
    ) {
      order.returnReason = updateStatusDto.reason;
      order.returnBy = updateStatusDto.changedBy || 'admin';
    }

    await order.save();

    // ⚡ مسح cache الطلب بعد التحديث
    await this.invalidateOrderCache(orderId);
    await this.invalidateUserOrdersCache(order.user.toString());

    return order;
  }

  // تعيين سائق للطلب
  async assignDriver(orderId: string, driverId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if ((order.status as OrderStatus) !== OrderStatus.READY) {
      throw new BadRequestException({
        code: 'INVALID_ORDER_STATUS',
        message: 'Order must be ready to assign driver',
        userMessage: 'يجب أن يكون الطلب جاهزاً لتعيين السائق',
        suggestedAction: 'يرجى تحديث حالة الطلب إلى "جاهز" أولاً',
      });
    }

    order.driver = new Types.ObjectId(driverId);
    order.status = OrderStatus.PICKED_UP;
    order.assignedAt = new Date();

    order.statusHistory.push({
      status: OrderStatus.PICKED_UP,
      changedAt: new Date(),
      changedBy: 'admin',
    });

    await order.save();

    // ⚡ مسح cache بعد التحديث
    await this.invalidateOrderCache(orderId);
    await this.invalidateUserOrdersCache(order.user.toString());

    return order;
  }

  // جلب طلبات السائق
  async findDriverOrders(driverId: string, pagination: CursorPaginationDto) {
    return PaginationHelper.paginate(
      this.orderModel,
      { driver: new Types.ObjectId(driverId) },
      pagination,
      {
        populate: { path: 'user', select: 'fullName phone' },
      },
    );
  }

  // ==================== Order Notes ====================

  async addNote(
    orderId: string,
    note: string,
    visibility: 'public' | 'internal' = 'internal',
    user: { role?: string; id: string },
  ) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    const noteObj = {
      body: note,
      visibility,
      byRole: user.role || 'customer',
      byId: user.id,
      createdAt: new Date(),
    };

    if (!order.notes) {
      order.notes = [];
    }

    order.notes.push(noteObj as never);
    await order.save();

    return { success: true, note: noteObj };
  }

  async getNotes(orderId: string) {
    const order = await this.orderModel.findById(orderId).select('notes');

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    return { notes: order.notes || [] };
  }

  // ==================== Vendor Operations ====================

  async vendorAcceptOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if ((order.status as OrderStatus) !== OrderStatus.CREATED) {
      throw new BadRequestException({
        code: 'INVALID_ORDER_STATUS',
        message: 'Order cannot be accepted in this status',
        userMessage: 'لا يمكن قبول الطلب في هذه الحالة',
      });
    }

    order.status = OrderStatus.CONFIRMED;
    order.statusHistory.push({
      status: OrderStatus.CONFIRMED,
      changedAt: new Date(),
      changedBy: 'vendor',
    });

    await order.save();
    return order;
  }

  async vendorCancelOrder(orderId: string, reason: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if (
      ![
        OrderStatus.CREATED,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
      ].includes(order.status as OrderStatus)
    ) {
      throw new BadRequestException({
        code: 'CANNOT_CANCEL',
        message: 'Order cannot be cancelled at this stage',
        userMessage: 'لا يمكن إلغاء الطلب في هذه المرحلة',
      });
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelReason = reason;
    order.canceledBy = 'vendor';
    order.canceledAt = new Date();

    order.statusHistory.push({
      status: OrderStatus.CANCELLED,
      changedAt: new Date(),
      changedBy: 'vendor',
      reason,
    } as never);

    await order.save();

    // TODO: Release wallet hold, refund, update inventory

    return order;
  }

  // ==================== POD (Proof of Delivery) ====================

  async setProofOfDelivery(
    orderId: string,
    pod: { imageUrl: string; signature?: string; notes?: string },
    driverId: string,
  ) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if (order.driver?.toString() !== driverId) {
      throw new BadRequestException({
        code: 'NOT_YOUR_ORDER',
        message: 'This is not your order',
        userMessage: 'هذا ليس طلبك',
      });
    }

    const orderDoc = order as unknown as {
      proofOfDelivery: {
        imageUrl: string;
        signature?: string;
        notes?: string;
        uploadedAt: Date;
        uploadedBy: string;
      };
      save: () => Promise<void>;
    };

    orderDoc.proofOfDelivery = {
      imageUrl: pod.imageUrl,
      signature: pod.signature,
      notes: pod.notes,
      uploadedAt: new Date(),
      uploadedBy: driverId,
    };

    await order.save();
    return { success: true };
  }

  async getProofOfDelivery(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .select('proofOfDelivery');

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    const orderDoc = order as unknown as {
      proofOfDelivery?: {
        imageUrl: string;
        signature?: string;
        notes?: string;
        uploadedAt: Date;
        uploadedBy: string;
      };
    };

    return { proofOfDelivery: orderDoc.proofOfDelivery || null };
  }

  // ==================== Cancel & Return ====================

  async cancelOrder(orderId: string, reason: string, userId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if (order.user.toString() !== userId) {
      throw new BadRequestException({
        code: 'NOT_YOUR_ORDER',
        message: 'This is not your order',
        userMessage: 'هذا ليس طلبك',
      });
    }

    if (
      ![OrderStatus.CREATED, OrderStatus.CONFIRMED].includes(
        order.status as OrderStatus,
      )
    ) {
      throw new BadRequestException({
        code: 'CANNOT_CANCEL',
        message: 'Order cannot be cancelled at this stage',
        userMessage: 'لا يمكن إلغاء الطلب في هذه المرحلة',
      });
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelReason = reason;
    order.canceledBy = 'customer';
    order.canceledAt = new Date();

    order.statusHistory.push({
      status: OrderStatus.CANCELLED,
      changedAt: new Date(),
      changedBy: 'customer',
      reason,
    } as never);

    await order.save();
    return order;
  }

  async returnOrder(orderId: string, reason: string, userId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if (order.user.toString() !== userId) {
      throw new BadRequestException({
        code: 'NOT_YOUR_ORDER',
        message: 'This is not your order',
        userMessage: 'هذا ليس طلبك',
      });
    }

    if ((order.status as OrderStatus) !== OrderStatus.DELIVERED) {
      throw new BadRequestException({
        code: 'CANNOT_RETURN',
        message: 'Only delivered orders can be returned',
        userMessage: 'يمكن إرجاع الطلبات المسلمة فقط',
      });
    }

    order.status = OrderStatus.RETURNED;
    order.returnReason = reason;
    order.returnBy = 'customer';
    order.returnedAt = new Date();

    order.statusHistory.push({
      status: OrderStatus.RETURNED,
      changedAt: new Date(),
      changedBy: 'customer',
      reason,
    } as never);

    await order.save();
    return order;
  }

  // ==================== Rating ====================

  async rateOrder(
    orderId: string,
    rating: number,
    comment: string | undefined,
    userId: string,
  ) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if (order.user.toString() !== userId) {
      throw new BadRequestException({
        code: 'NOT_YOUR_ORDER',
        message: 'This is not your order',
        userMessage: 'هذا ليس طلبك',
      });
    }

    if ((order.status as OrderStatus) !== OrderStatus.DELIVERED) {
      throw new BadRequestException({
        code: 'CANNOT_RATE',
        message: 'Only delivered orders can be rated',
        userMessage: 'يمكن تقييم الطلبات المسلمة فقط',
      });
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException({
        code: 'INVALID_RATING',
        message: 'Rating must be between 1 and 5',
        userMessage: 'التقييم يجب أن يكون بين 1 و 5',
      });
    }

    order.rating = rating;
    order.ratingComment = comment;
    order.ratedAt = new Date();

    await order.save();
    return { success: true, rating, comment };
  }

  // ==================== Repeat Order ====================

  async repeatOrder(orderId: string, userId: string) {
    const originalOrder = await this.orderModel.findById(orderId);

    if (!originalOrder) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    if (originalOrder.user.toString() !== userId) {
      throw new BadRequestException({
        code: 'NOT_YOUR_ORDER',
        message: 'This is not your order',
        userMessage: 'هذا ليس طلبك',
      });
    }

    // Create new order with same items
    const newOrder = await this.orderModel.create({
      user: originalOrder.user,
      items: originalOrder.items,
      deliveryAddress: originalOrder.deliveryAddress,
      paymentMethod: originalOrder.paymentMethod,
      price: originalOrder.price,
      deliveryFee: originalOrder.deliveryFee,
      totalAmount: originalOrder.totalAmount,
      status: OrderStatus.CREATED,
      statusHistory: [
        {
          status: OrderStatus.CREATED,
          changedAt: new Date(),
          changedBy: 'customer',
        },
      ],
    });

    return newOrder;
  }

  // ==================== Admin Operations ====================

  async adminChangeStatus(
    orderId: string,
    status: string,
    reason: string | undefined,
  ) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    order.status = status as OrderStatus;
    order.statusHistory.push({
      status: status as OrderStatus,
      changedAt: new Date(),
      changedBy: 'admin',
      reason,
    } as never);

    if (order.adminNotes) {
      order.adminNotes += `\n[${new Date().toISOString()}] Status changed to ${status}${reason ? ': ' + reason : ''}`;
    } else {
      order.adminNotes = `[${new Date().toISOString()}] Status changed to ${status}${reason ? ': ' + reason : ''}`;
    }

    await order.save();
    return order;
  }

  async exportOrders(startDate?: string, endDate?: string, status?: string) {
    const query: Record<string, unknown> = {};

    if (startDate || endDate) {
      const dateQuery: Record<string, Date> = {};
      if (startDate) dateQuery.$gte = new Date(startDate);
      if (endDate) dateQuery.$lte = new Date(endDate);
      query.createdAt = dateQuery;
    }

    if (status) {
      query.status = status;
    }

    const orders = await this.orderModel
      .find(query)
      .populate('user', 'fullName phone')
      .populate('driver', 'fullName phone')
      .sort({ createdAt: -1 })
      .lean();

    // TODO: Convert to Excel/CSV format

    return {
      total: orders.length,
      orders: orders.map((order) => {
        const orderDoc = order as unknown as {
          _id: unknown;
          user?: { fullName?: string; phone?: string };
          driver?: { fullName?: string; phone?: string };
          status: string;
          totalAmount: number;
          createdAt: Date;
        };
        return {
          id: orderDoc._id,
          userName: orderDoc.user?.fullName,
          userPhone: orderDoc.user?.phone,
          driverName: orderDoc.driver?.fullName,
          status: orderDoc.status,
          totalAmount: orderDoc.totalAmount,
          createdAt: orderDoc.createdAt,
        };
      }),
    };
  }

  // ==================== Tracking ====================

  async trackOrder(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('driver', 'fullName phone currentLocation')
      .lean();

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        userMessage: 'الطلب غير موجود',
      });
    }

    const driverDoc = order.driver as unknown as {
      fullName?: string;
      phone?: string;
      currentLocation?: unknown;
    };

    const orderDoc = order as unknown as {
      _id: unknown;
      status: string;
      statusHistory: unknown;
      deliveryAddress: unknown;
      estimatedDeliveryTime?: Date;
    };

    return {
      orderId: orderDoc._id,
      status: orderDoc.status,
      statusHistory: orderDoc.statusHistory,
      driver: order.driver
        ? {
            name: driverDoc.fullName,
            phone: driverDoc.phone,
            location: driverDoc.currentLocation,
          }
        : null,
      estimatedDeliveryTime: orderDoc.estimatedDeliveryTime,
      deliveryAddress: orderDoc.deliveryAddress,
    };
  }

  async scheduleOrder(orderId: string, scheduledDate: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        userMessage: 'الطلب غير موجود',
      });
    }

    const orderDoc = order as unknown as {
      scheduledDate: Date;
      save: () => Promise<void>;
    };
    orderDoc.scheduledDate = new Date(scheduledDate);
    await order.save();

    return { success: true, message: 'تم جدولة الطلب', order };
  }

  async getPublicOrderStatus(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .select('status updatedAt');
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        userMessage: 'الطلب غير موجود',
      });
    }

    const orderDoc = order as unknown as {
      status: string;
      updatedAt: Date;
      estimatedDeliveryTime?: Date;
    };

    return {
      status: orderDoc.status,
      updatedAt: orderDoc.updatedAt,
      estimatedDelivery: orderDoc.estimatedDeliveryTime,
    };
  }

  // ==================== Real-time Tracking Extensions ====================

  async getLiveTracking(orderId: string) {
    const order = await this.orderModel.findById(orderId).populate('driver');
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        userMessage: 'الطلب غير موجود',
      });
    }

    const driverDoc = order.driver as unknown as {
      _id?: unknown;
      fullName?: string;
      phone?: string;
      currentLocation?: unknown;
      rating?: number;
    };

    const orderDoc = order as unknown as {
      _id: unknown;
      status: string;
      estimatedDeliveryTime?: Date;
    };

    return {
      orderId: orderDoc._id,
      status: orderDoc.status,
      driver: order.driver
        ? {
            id: driverDoc._id,
            name: driverDoc.fullName,
            phone: driverDoc.phone,
            currentLocation: driverDoc.currentLocation,
            rating: driverDoc.rating,
          }
        : null,
      estimatedArrival: orderDoc.estimatedDeliveryTime,
      lastUpdate: new Date(),
    };
  }

  async getDriverETA(orderId: string) {
    const order = await this.orderModel.findById(orderId).populate('driver');
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        userMessage: 'الطلب غير موجود',
      });
    }

    // TODO: Calculate ETA based on driver location and destination
    const estimatedMinutes = 15;

    const driverDoc = order.driver as unknown as {
      currentLocation?: unknown;
    };

    return {
      orderId: order._id,
      estimatedMinutes,
      estimatedArrivalTime: new Date(Date.now() + estimatedMinutes * 60000),
      distance: 0, // TODO: Calculate distance
      driverLocation: driverDoc?.currentLocation,
    };
  }

  async updateDriverLocation(orderId: string, lat: number, lng: number) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        userMessage: 'الطلب غير موجود',
      });
    }

    // TODO: Save location history
    // TODO: Emit socket event for real-time tracking

    return {
      success: true,
      message: 'تم تحديث الموقع',
      location: { lat, lng },
      timestamp: new Date(),
    };
  }

  async getRouteHistory(orderId: string) {
    // TODO: Get route history from location logs
    await Promise.resolve(); // Adding await to satisfy linter
    return {
      orderId,
      route: [],
      totalDistance: 0,
      duration: 0,
    };
  }

  async getDeliveryTimeline(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        userMessage: 'الطلب غير موجود',
      });
    }

    const orderDoc = order as unknown as {
      _id: unknown;
      createdAt: Date;
    };

    return {
      orderId: orderDoc._id,
      events: [
        {
          status: 'created',
          timestamp: orderDoc.createdAt,
          description: 'تم إنشاء الطلب',
        },
        // TODO: Add more timeline events from status history
      ],
    };
  }

  // ==================== Bulk Operations (للأداء الأفضل) ====================

  /**
   * تحديث حالة عدة طلبات دفعة واحدة
   * ✅ أسرع بكثير من updateOne لكل طلب
   */
  async bulkUpdateStatus(
    orderIds: string[],
    status: OrderStatus,
    changedBy: string = 'admin',
  ) {
    if (!orderIds || orderIds.length === 0) {
      return { modifiedCount: 0 };
    }

    // استخدام bulkWrite للأداء الأفضل
    const result = await BulkOperationsUtil.bulkUpdateByIds(
      this.orderModel,
      orderIds,
      {
        status,
        $push: {
          statusHistory: {
            status,
            changedAt: new Date(),
            changedBy,
          },
        },
      } as never,
    );

    // مسح cache للطلبات المحدثة
    await Promise.all(orderIds.map((id) => this.invalidateOrderCache(id)));

    return {
      modifiedCount: result.modifiedCount,
      message: `تم تحديث ${result.modifiedCount} طلب`,
    };
  }

  /**
   * تعيين سائق لعدة طلبات دفعة واحدة
   */
  async bulkAssignDriver(orderIds: string[], driverId: string) {
    if (!orderIds || orderIds.length === 0) {
      return { modifiedCount: 0 };
    }

    const result = await BulkOperationsUtil.bulkUpdateByIds(
      this.orderModel,
      orderIds,
      {
        driver: new Types.ObjectId(driverId),
        assignedAt: new Date(),
        $push: {
          statusHistory: {
            status: OrderStatus.PICKED_UP,
            changedAt: new Date(),
            changedBy: 'admin',
          },
        },
      } as never,
    );

    // مسح cache
    await Promise.all(orderIds.map((id) => this.invalidateOrderCache(id)));

    return {
      modifiedCount: result.modifiedCount,
      message: `تم تعيين السائق لـ ${result.modifiedCount} طلب`,
    };
  }

  /**
   * معالجة الطلبات بمجموعات (chunks) للأداء الأفضل
   */
  async processOrdersInBatch(
    orderIds: string[],
    operation: (order: Order) => Promise<void>,
    chunkSize: number = 100,
  ) {
    const orders = await this.orderModel
      .find({ _id: { $in: orderIds.map((id) => new Types.ObjectId(id)) } })
      .lean();

    await BulkOperationsUtil.processInChunks(
      orders,
      chunkSize,
      async (chunk) => {
        await Promise.all(
          chunk.map((order) => operation(order as unknown as Order)),
        );
      },
    );

    return {
      processed: orders.length,
      message: `تمت معالجة ${orders.length} طلب`,
    };
  }

  /**
   * إلغاء عدة طلبات دفعة واحدة
   */
  async bulkCancelOrders(
    orderIds: string[],
    reason: string,
    canceledBy: string = 'admin',
  ) {
    const updates = orderIds.map((id) => ({
      filter: { _id: new Types.ObjectId(id) },
      update: {
        status: OrderStatus.CANCELLED,
        cancelReason: reason,
        canceledBy,
        canceledAt: new Date(),
        $push: {
          statusHistory: {
            status: OrderStatus.CANCELLED,
            changedAt: new Date(),
            changedBy: canceledBy,
            reason,
          },
        },
      } as never,
    }));

    const result = await BulkOperationsUtil.bulkUpdate(
      this.orderModel,
      updates,
    );

    // مسح cache
    await Promise.all(orderIds.map((id) => this.invalidateOrderCache(id)));

    return {
      modifiedCount: result.modifiedCount,
      message: `تم إلغاء ${result.modifiedCount} طلب`,
    };
  }
}
