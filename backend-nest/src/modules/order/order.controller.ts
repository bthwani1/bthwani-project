import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Order')
@Controller('delivery/order')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth(AuthType.FIREBASE)
  @Post()
  @ApiOperation({
    summary: 'إنشاء طلب جديد',
    description: 'إنشاء طلب جديد مع العناصر والعنوان',
  })
  @ApiBody({ type: CreateOrderDto, description: 'بيانات الطلب' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الطلب بنجاح' })
  @ApiResponse({ status: 400, description: 'بيانات غير صحيحة' })
  @ApiResponse({ status: 401, description: 'غير مصرّح' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.create({ ...createOrderDto, user: userId });
  }

  @Auth(AuthType.FIREBASE)
  @Get('user/:userId')
  @ApiOperation({
    summary: 'جلب طلبات مستخدم محدد',
    description: 'جلب جميع طلبات مستخدم معين',
  })
  async getUserOrders(
    @Param('userId') userId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.orderService.findUserOrders(userId, pagination);
  }

  @Auth(AuthType.FIREBASE)
  @Get('my-orders')
  @ApiOperation({
    summary: 'جلب طلبات المستخدم الحالي',
    description: 'جلب جميع طلبات المستخدم الحالي مع pagination',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor للصفحة التالية',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'عدد النتائج (default: 20)',
  })
  @ApiResponse({ status: 200, description: 'قائمة الطلبات' })
  @ApiResponse({ status: 401, description: 'غير مصرّح' })
  async getMyOrders(
    @CurrentUser('id') userId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.orderService.findUserOrders(userId, pagination);
  }

  @Auth(AuthType.FIREBASE)
  @Get(':id')
  @ApiOperation({ summary: 'تفاصيل الطلب' })
  async getOrder(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // ==================== Driver Assignment ====================

  @Auth(AuthType.JWT)
  @Post(':id/assign-driver')
  @ApiOperation({
    summary: 'تعيين سائق للطلب',
    description: 'تعيين سائق متاح للطلب (Admin/Dispatcher)',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { driverId: { type: 'string', description: 'معرّف السائق' } },
      required: ['driverId'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم تعيين السائق بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب أو السائق غير موجود' })
  @ApiResponse({ status: 401, description: 'غير مصرّح' })
  async assignDriver(
    @Param('id') orderId: string,
    @Body() body: { driverId: string },
  ) {
    return this.orderService.assignDriver(orderId, body.driverId);
  }

  // ==================== Order Notes ====================

  @Auth(AuthType.JWT)
  @Post(':id/notes')
  @ApiOperation({
    summary: 'إضافة ملاحظة للطلب',
    description: 'إضافة ملاحظة عامة أو خاصة للطلب',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { note: { type: 'string', description: 'نص الملاحظة' } },
      required: ['note'],
    },
  })
  @ApiResponse({ status: 200, description: 'تمت إضافة الملاحظة بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 401, description: 'غير مصرّح' })
  async addNote(
    @Param('id') orderId: string,
    @Body() body: { note: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.addNote(orderId, body.note, 'public', {
      id: userId,
    });
  }

  @Auth(AuthType.FIREBASE)
  @Get(':id/notes')
  @ApiOperation({ summary: 'جلب الملاحظات' })
  async getNotes(@Param('id') orderId: string) {
    return this.orderService.getNotes(orderId);
  }

  // ==================== Vendor Operations ====================

  @Auth(AuthType.VENDOR_JWT)
  @Get('vendor/orders')
  @ApiOperation({ summary: 'جلب طلبات التاجر' })
  async getVendorOrders(
    @CurrentUser('id') vendorId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.orderService.findVendorOrders(vendorId, pagination);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Post(':id/vendor-accept')
  @ApiOperation({
    summary: 'قبول الطلب من قبل التاجر',
    description: 'قبول الطلب والبدء في التحضير',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiResponse({ status: 200, description: 'تم قبول الطلب بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 403, description: 'ليس لديك صلاحية' })
  @ApiResponse({ status: 400, description: 'الطلب لا يمكن قبوله' })
  async vendorAcceptOrder(@Param('id') orderId: string) {
    return this.orderService.vendorAcceptOrder(orderId);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Post(':id/vendor-cancel')
  @ApiOperation({
    summary: 'إلغاء الطلب من قبل التاجر',
    description: 'إلغاء الطلب مع تحديد السبب',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { reason: { type: 'string', description: 'سبب الإلغاء' } },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم إلغاء الطلب بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 403, description: 'ليس لديك صلاحية' })
  async vendorCancelOrder(
    @Param('id') orderId: string,
    @Body() body: { reason: string },
  ) {
    return this.orderService.vendorCancelOrder(orderId, body.reason);
  }

  // ==================== Proof of Delivery ====================

  @Auth(AuthType.JWT)
  @Post(':id/pod')
  @ApiOperation({
    summary: 'إضافة إثبات التسليم (POD)',
    description: 'إضافة صورة وتوقيع كإثبات على التسليم',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string', description: 'رابط صورة الإثبات' },
        signature: { type: 'string', description: 'توقيع العميل (اختياري)' },
        notes: { type: 'string', description: 'ملاحظات إضافية (اختياري)' },
      },
      required: ['imageUrl'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم إضافة إثبات التسليم بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 403, description: 'ليس لديك صلاحية' })
  async setProofOfDelivery(
    @Param('id') orderId: string,
    @Body() body: { imageUrl: string; signature?: string; notes?: string },
    @CurrentUser('id') driverId: string,
  ) {
    return this.orderService.setProofOfDelivery(orderId, body, driverId);
  }

  @Auth(AuthType.FIREBASE)
  @Get(':id/pod')
  @ApiOperation({ summary: 'جلب إثبات التسليم' })
  async getProofOfDelivery(@Param('id') orderId: string) {
    return this.orderService.getProofOfDelivery(orderId);
  }

  // ==================== Cancel & Return ====================

  @Auth(AuthType.FIREBASE)
  @Post(':id/cancel')
  @ApiOperation({
    summary: 'إلغاء الطلب',
    description: 'إلغاء الطلب من قبل العميل مع ذكر السبب',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { reason: { type: 'string', description: 'سبب الإلغاء' } },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم إلغاء الطلب بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 400, description: 'لا يمكن إلغاء الطلب' })
  async cancelOrder(
    @Param('id') orderId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.cancelOrder(orderId, body.reason, userId);
  }

  @Auth(AuthType.FIREBASE)
  @Post(':id/return')
  @ApiOperation({
    summary: 'طلب إرجاع المنتج',
    description: 'إرجاع المنتج بعد التسليم مع ذكر السبب',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { reason: { type: 'string', description: 'سبب الإرجاع' } },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم إنشاء طلب الإرجاع بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 400, description: 'لا يمكن إرجاع الطلب' })
  async returnOrder(
    @Param('id') orderId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.returnOrder(orderId, body.reason, userId);
  }

  // ==================== Rating ====================

  @Auth(AuthType.FIREBASE)
  @Post(':id/rate')
  @ApiOperation({
    summary: 'تقييم الطلب',
    description: 'تقييم الطلب والخدمة بعد التسليم',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', minimum: 1, maximum: 5 },
        comment: { type: 'string' },
      },
      required: ['rating'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم التقييم بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 400, description: 'التقييم غير صالح' })
  async rateOrder(
    @Param('id') orderId: string,
    @Body() body: { rating: number; comment?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.rateOrder(
      orderId,
      body.rating,
      body.comment,
      userId,
    );
  }

  // ==================== Repeat Order ====================

  @Auth(AuthType.FIREBASE)
  @Post(':id/repeat')
  @ApiOperation({
    summary: 'إعادة طلب سابق',
    description: 'إعادة نفس الطلب بنفس العناصر',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب السابق' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الطلب الجديد بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب السابق غير موجود' })
  @ApiResponse({ status: 400, description: 'لا يمكن إعادة هذا الطلب' })
  async repeatOrder(
    @Param('id') orderId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.repeatOrder(orderId, userId);
  }

  // ==================== Admin Operations ====================

  @Auth(AuthType.JWT)
  @Patch(':id/admin-status')
  @ApiOperation({ summary: 'تغيير حالة الطلب (admin)' })
  async adminChangeStatus(
    @Param('id') orderId: string,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.orderService.adminChangeStatus(
      orderId,
      body.status,
      body.reason,
    );
  }

  @Auth(AuthType.JWT)
  @Get('export')
  @ApiOperation({
    summary: 'تصدير الطلبات إلى Excel/CSV',
    description: 'تصدير قائمة الطلبات بصيغة CSV أو Excel',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'تاريخ البداية (ISO format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'تاريخ النهاية (ISO format)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'حالة الطلب للتصفية',
  })
  @ApiResponse({ status: 200, description: 'ملف التصدير' })
  @ApiResponse({ status: 401, description: 'غير مصرّح (admin only)' })
  async exportOrders(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    return this.orderService.exportOrders(startDate, endDate, status);
  }

  // ==================== Tracking ====================

  @Auth(AuthType.FIREBASE)
  @Get(':id/tracking')
  @ApiOperation({ summary: 'تتبع الطلب' })
  async trackOrder(@Param('id') orderId: string) {
    return this.orderService.trackOrder(orderId);
  }

  @Auth(AuthType.JWT)
  @Post(':id/schedule')
  @ApiOperation({
    summary: 'جدولة طلب للتوصيل لاحقاً',
    description: 'تحديد موعد محدد لتوصيل الطلب',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        scheduledDate: {
          type: 'string',
          format: 'date-time',
          description: 'تاريخ ووقت التوصيل المطلوب',
        },
      },
      required: ['scheduledDate'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم جدولة الطلب بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 400, description: 'التاريخ غير صالح' })
  async scheduleOrder(
    @Param('id') orderId: string,
    @Body() body: { scheduledDate: string },
  ) {
    return this.orderService.scheduleOrder(orderId, body.scheduledDate);
  }

  @Get('public/:id/status')
  @ApiOperation({
    summary: 'حالة الطلب (عام بدون مصادقة)',
    description: 'الحصول على حالة الطلب للمشاركة العامة',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiResponse({ status: 200, description: 'حالة الطلب' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  async getPublicOrderStatus(@Param('id') orderId: string) {
    return this.orderService.getPublicOrderStatus(orderId);
  }

  // ==================== Real-time Tracking Extensions ====================

  @Auth(AuthType.FIREBASE)
  @Get(':id/live-tracking')
  @ApiOperation({ summary: 'التتبع المباشر' })
  async getLiveTracking(@Param('id') orderId: string) {
    return this.orderService.getLiveTracking(orderId);
  }

  @Auth(AuthType.FIREBASE)
  @Get(':id/driver-eta')
  @ApiOperation({ summary: 'الوقت المتوقع للوصول' })
  async getDriverETA(@Param('id') orderId: string) {
    return this.orderService.getDriverETA(orderId);
  }

  @Auth(AuthType.JWT)
  @Post(':id/update-location')
  @ApiOperation({
    summary: 'تحديث موقع السائق',
    description: 'تحديث موقع السائق أثناء التوصيل (GPS tracking)',
  })
  @ApiParam({ name: 'id', description: 'معرّف الطلب' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'خط العرض' },
        lng: { type: 'number', description: 'خط الطول' },
      },
      required: ['lat', 'lng'],
    },
  })
  @ApiResponse({ status: 200, description: 'تم تحديث الموقع بنجاح' })
  @ApiResponse({ status: 404, description: 'الطلب غير موجود' })
  @ApiResponse({ status: 403, description: 'ليس لديك صلاحية (driver only)' })
  async updateDriverLocation(
    @Param('id') orderId: string,
    @Body() body: { lat: number; lng: number },
  ) {
    return this.orderService.updateDriverLocation(orderId, body.lat, body.lng);
  }

  @Auth(AuthType.FIREBASE)
  @Get(':id/route-history')
  @ApiOperation({ summary: 'سجل المسار' })
  async getRouteHistory(@Param('id') orderId: string) {
    return this.orderService.getRouteHistory(orderId);
  }

  @Auth(AuthType.FIREBASE)
  @Get(':id/delivery-timeline')
  @ApiOperation({ summary: 'خط زمني للتوصيل' })
  async getDeliveryTimeline(@Param('id') orderId: string) {
    return this.orderService.getDeliveryTimeline(orderId);
  }
}
