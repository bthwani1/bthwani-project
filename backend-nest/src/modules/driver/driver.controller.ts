import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  Auth,
  Roles,
  CurrentUser,
} from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Driver')
@ApiBearerAuth()
@Controller('drivers')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Post()
  @ApiOperation({ summary: 'إنشاء سائق جديد (للإدارة)' })
  async create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Auth(AuthType.JWT)
  @Get('available')
  @ApiOperation({ summary: 'جلب السائقين المتاحين' })
  async findAvailable(@Query() pagination: CursorPaginationDto) {
    return this.driverService.findAvailable(pagination);
  }

  @Auth(AuthType.JWT)
  @Get(':id')
  @ApiOperation({ summary: 'جلب سائق محدد' })
  async findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Patch('location')
  @ApiOperation({ summary: 'تحديث موقع السائق' })
  async updateLocation(
    @CurrentUser('id') driverId: string,
    @Body() locationDto: UpdateLocationDto,
  ) {
    return this.driverService.updateLocation(driverId, locationDto);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Patch('availability')
  @ApiOperation({ summary: 'تحديث حالة التوفر' })
  async updateAvailability(
    @CurrentUser('id') driverId: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.driverService.updateAvailability(driverId, isAvailable);
  }

  // ==================== Driver Profile ====================

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('profile')
  @ApiOperation({ summary: 'ملفي الشخصي' })
  async getProfile(@CurrentUser('id') driverId: string) {
    return this.driverService.getProfile(driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Patch('profile')
  @ApiOperation({ summary: 'تحديث الملف الشخصي' })
  async updateProfile(@CurrentUser('id') driverId: string, @Body() body: any) {
    return this.driverService.updateProfile(driverId, body);
  }

  // ==================== Driver Earnings ====================

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('earnings')
  @ApiOperation({ summary: 'أرباحي' })
  async getEarnings(
    @CurrentUser('id') driverId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.driverService.getEarnings(driverId, startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('earnings/daily')
  @ApiOperation({ summary: 'أرباح اليوم' })
  async getDailyEarnings(@CurrentUser('id') driverId: string) {
    return this.driverService.getDailyEarnings(driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('earnings/weekly')
  @ApiOperation({ summary: 'أرباح الأسبوع' })
  async getWeeklyEarnings(@CurrentUser('id') driverId: string) {
    return this.driverService.getWeeklyEarnings(driverId);
  }

  // ==================== Driver Statistics ====================

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('statistics')
  @ApiOperation({ summary: 'إحصائياتي' })
  async getStatistics(@CurrentUser('id') driverId: string) {
    return this.driverService.getStatistics(driverId);
  }

  // ==================== Driver Documents ====================

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('documents/upload')
  @ApiOperation({ summary: 'رفع مستند' })
  async uploadDocument(
    @CurrentUser('id') driverId: string,
    @Body()
    body: {
      type: string;
      fileUrl: string;
      expiryDate?: string;
    },
  ) {
    return this.driverService.uploadDocument(driverId, body);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('documents')
  @ApiOperation({ summary: 'مستنداتي' })
  async getDocuments(@CurrentUser('id') driverId: string) {
    return this.driverService.getDocuments(driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Get(':driverId/documents')
  @ApiOperation({ summary: 'مستندات سائق (Admin)' })
  async getDriverDocumentsAdmin(@Param('driverId') driverId: string) {
    return this.driverService.getDocuments(driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Post(':driverId/documents/:docId/verify')
  @ApiOperation({ summary: 'التحقق من مستند (Admin)' })
  async verifyDocument(
    @Param('driverId') driverId: string,
    @Param('docId') docId: string,
    @Body() body: { verified: boolean; notes?: string },
    @CurrentUser('id') adminId: string,
  ) {
    // استدعاء service method
    return { message: 'تم التحقق من المستند', driverId, docId, verified: body.verified, adminId };
  }

  // ==================== Driver Vacations ====================

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('vacations/request')
  @ApiOperation({ summary: 'طلب إجازة' })
  async requestVacation(
    @CurrentUser('id') driverId: string,
    @Body()
    body: {
      startDate: string;
      endDate: string;
      type: string;
      reason?: string;
    },
  ) {
    return this.driverService.requestVacation(driverId, body);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('vacations/my')
  @ApiOperation({ summary: 'إجازاتي' })
  async getMyVacations(@CurrentUser('id') driverId: string) {
    return this.driverService.getMyVacations(driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Patch('vacations/:id/cancel')
  @ApiOperation({ summary: 'إلغاء طلب إجازة' })
  async cancelVacation(
    @Param('id') vacationId: string,
    @CurrentUser('id') driverId: string,
  ) {
    return this.driverService.cancelVacation(vacationId, driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('vacations/balance')
  @ApiOperation({ summary: 'رصيد الإجازات' })
  async getVacationBalance(@CurrentUser('id') driverId: string) {
    return this.driverService.getVacationBalance(driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('vacations/policy')
  @ApiOperation({ summary: 'سياسة الإجازات' })
  async getVacationPolicy() {
    return this.driverService.getVacationPolicy();
  }

  // ==================== Driver Withdrawals ====================
  // ✅ تم نقل طلبات السحب إلى WalletController - استخدم /wallet/withdraw/request بدلاً من ذلك

  // ==================== Driver Orders (Advanced) ====================

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('orders/available')
  @ApiOperation({ summary: 'الطلبات المتاحة للاستلام' })
  async getAvailableOrders(@CurrentUser('id') driverId: string) {
    return this.driverService.getAvailableOrders(driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('orders/:id/accept')
  @ApiOperation({ summary: 'قبول طلب' })
  async acceptOrder(
    @Param('id') orderId: string,
    @CurrentUser('id') driverId: string,
  ) {
    return this.driverService.acceptOrder(orderId, driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('orders/:id/reject')
  @ApiOperation({ summary: 'رفض طلب' })
  async rejectOrder(
    @Param('id') orderId: string,
    @CurrentUser('id') driverId: string,
    @Body() body: { reason: string },
  ) {
    return this.driverService.rejectOrder(orderId, driverId, body.reason);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('orders/:id/start-delivery')
  @ApiOperation({ summary: 'بدء التوصيل' })
  async startDelivery(
    @Param('id') orderId: string,
    @CurrentUser('id') driverId: string,
  ) {
    return this.driverService.startDelivery(orderId, driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('orders/:id/complete')
  @ApiOperation({ summary: 'إتمام التوصيل' })
  async completeDelivery(
    @Param('id') orderId: string,
    @CurrentUser('id') driverId: string,
  ) {
    return this.driverService.completeDelivery(orderId, driverId);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Get('orders/history')
  @ApiOperation({ summary: 'سجل الطلبات' })
  async getOrdersHistory(
    @CurrentUser('id') driverId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.driverService.getOrdersHistory(driverId, pagination);
  }

  // ==================== Driver Issues ====================

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('issues/report')
  @ApiOperation({ summary: 'الإبلاغ عن مشكلة' })
  async reportIssue(
    @CurrentUser('id') driverId: string,
    @Body() body: { type: string; description: string; orderId?: string },
  ) {
    return this.driverService.reportIssue(driverId, body);
  }

  @Auth(AuthType.JWT)
  @Roles('driver')
  @Post('change-password')
  @ApiOperation({ summary: 'تغيير كلمة المرور' })
  async changePassword(
    @CurrentUser('id') driverId: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.driverService.changePassword(
      driverId,
      body.oldPassword,
      body.newPassword,
    );
  }
}
