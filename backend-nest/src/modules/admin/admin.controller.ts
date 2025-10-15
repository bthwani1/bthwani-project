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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  Auth,
  Roles,
  CurrentUser,
} from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(UnifiedAuthGuard, RolesGuard)
@Auth(AuthType.JWT)
@Roles('admin', 'superadmin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== Dashboard ====================

  @Get('dashboard')
  @ApiOperation({ summary: 'لوحة التحكم - الإحصائيات العامة' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/today')
  @ApiOperation({ summary: 'إحصائيات اليوم' })
  async getTodayStats() {
    return this.adminService.getTodayStats();
  }

  @Get('stats/financial')
  @ApiOperation({ summary: 'الإحصائيات المالية' })
  async getFinancialStats() {
    return this.adminService.getFinancialStats();
  }

  @Get('dashboard/orders-by-status')
  @ApiOperation({ summary: 'الطلبات حسب الحالة' })
  async getOrdersByStatus(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getOrdersByStatus({ startDate, endDate });
  }

  @Get('dashboard/revenue')
  @ApiOperation({ summary: 'تحليلات الإيرادات' })
  async getRevenueAnalytics(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getRevenueAnalytics({
      period,
      startDate,
      endDate,
    });
  }

  @Get('dashboard/live-metrics')
  @ApiOperation({ summary: 'المقاييس الحية' })
  async getLiveMetrics() {
    return this.adminService.getLiveMetrics();
  }

  // ==================== Drivers Management ====================

  @Get('drivers')
  @ApiOperation({ summary: 'جلب كل السائقين' })
  async getAllDrivers(
    @Query('status') status?: string,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getAllDrivers({
      status,
      isAvailable,
      page,
      limit,
    });
  }

  @Get('drivers/:id')
  @ApiOperation({ summary: 'تفاصيل سائق محدد' })
  async getDriverDetails(@Param('id') driverId: string) {
    return this.adminService.getDriverDetails(driverId);
  }

  @Get('drivers/:id/performance')
  @ApiOperation({ summary: 'أداء السائق' })
  async getDriverPerformance(
    @Param('id') driverId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.adminService.getDriverPerformance(driverId, {
      startDate,
      endDate,
    });
  }

  @Get('drivers/:id/financials')
  @ApiOperation({ summary: 'مالية السائق' })
  async getDriverFinancials(@Param('id') driverId: string) {
    return this.adminService.getDriverFinancials(driverId);
  }

  @Post('drivers/:id/ban')
  @ApiOperation({ summary: 'حظر سائق' })
  async banDriver(
    @Param('id') driverId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.banDriver({
      driverId,
      reason: body.reason,
      adminId,
    });
  }

  @Post('drivers/:id/unban')
  @ApiOperation({ summary: 'إلغاء حظر سائق' })
  async unbanDriver(
    @Param('id') driverId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.unbanDriver(driverId, adminId);
  }

  @Patch('drivers/:id/adjust-balance')
  @ApiOperation({ summary: 'تعديل رصيد السائق' })
  async adjustDriverBalance(
    @Param('id') driverId: string,
    @Body() body: { amount: number; reason: string; type: 'credit' | 'debit' },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.adjustDriverBalance({
      driverId,
      amount: body.amount,
      type: body.type,
      reason: body.reason,
      adminId,
    });
  }

  // ==================== Withdrawals Management ====================

  @Get('withdrawals')
  @ApiOperation({ summary: 'جلب طلبات السحب' })
  getWithdrawals(
    @Query('status') status?: string,
    @Query('userModel') userModel?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getWithdrawals({
      status,
      userModel,
      page,
      limit,
    });
  }

  @Get('withdrawals/pending')
  @ApiOperation({ summary: 'طلبات السحب المعلقة' })
  getPendingWithdrawals() {
    return this.adminService.getPendingWithdrawals();
  }

  @Patch('withdrawals/:id/approve')
  @ApiOperation({ summary: 'الموافقة على طلب سحب' })
  async approveWithdrawal(
    @Param('id') withdrawalId: string,
    @Body() body: { transactionRef?: string; notes?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return await this.adminService.approveWithdrawal({
      withdrawalId,
      adminId,
      transactionRef: body.transactionRef,
      notes: body.notes,
    });
  }

  @Patch('withdrawals/:id/reject')
  @ApiOperation({ summary: 'رفض طلب سحب' })
  async rejectWithdrawal(
    @Param('id') withdrawalId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return await this.adminService.rejectWithdrawal({
      withdrawalId,
      reason: body.reason,
      adminId,
    });
  }

  // ==================== Store Moderation ====================

  // ==================== Vendor Moderation ====================

  @Get('vendors/pending')
  @ApiOperation({ summary: 'التجار المعلقين' })
  async getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Post('vendors/:id/approve')
  @ApiOperation({ summary: 'الموافقة على تاجر' })
  async approveVendor(
    @Param('id') vendorId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.approveVendor(vendorId, adminId);
  }

  @Post('vendors/:id/reject')
  @ApiOperation({ summary: 'رفض تاجر' })
  async rejectVendor(
    @Param('id') vendorId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.rejectVendor(vendorId, body.reason, adminId);
  }

  @Post('vendors/:id/suspend')
  @ApiOperation({ summary: 'تعليق تاجر' })
  async suspendVendor(
    @Param('id') vendorId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.suspendVendor(vendorId, body.reason, adminId);
  }

  // ==================== Users Management ====================

  @Get('users')
  @ApiOperation({ summary: 'جلب المستخدمين' })
  async getUsers(
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getUsers({
      search,
      isActive,
      page,
      limit,
    });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'تفاصيل مستخدم' })
  async getUserDetails(@Param('id') userId: string) {
    return this.adminService.getUserDetails(userId);
  }

  @Post('users/:id/ban')
  @ApiOperation({ summary: 'حظر مستخدم' })
  async banUser(
    @Param('id') userId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.banUser({
      userId,
      reason: body.reason,
      adminId,
    });
  }

  @Post('users/:id/unban')
  @ApiOperation({ summary: 'إلغاء حظر مستخدم' })
  async unbanUser(
    @Param('id') userId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.unbanUser(userId, adminId);
  }

  // ==================== Reports ====================

  @Get('reports/daily')
  @ApiOperation({ summary: 'تقرير يومي' })
  async getDailyReport(@Query('date') date?: string) {
    return this.adminService.getDailyReport({ date });
  }

  // TODO: Implement getWeeklyReport
  // TODO: Implement getMonthlyReport
  // TODO: Implement exportReport

  // ==================== Notifications ====================
  // ✅ تم نقل الإشعارات إلى NotificationController - استخدم /notifications

  // ==================== Driver Assets ====================
  // TODO: Implement Driver Assets Management

  // ==================== Driver Documents ====================
  // ✅ تم دمج إدارة المستندات في DriverController - استخدم /drivers/documents

  // ==================== Driver Attendance ====================

  @Get('drivers/:id/attendance')
  @ApiOperation({ summary: 'سجل حضور السائق' })
  async getDriverAttendance(
    @Param('id') driverId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.adminService.getDriverAttendance(driverId, { month, year });
  }

  @Get('drivers/attendance/summary')
  @ApiOperation({ summary: 'ملخص الحضور لكل السائقين' })
  async getAttendanceSummary(@Query('date') date?: string) {
    return this.adminService.getAttendanceSummary(date);
  }

  @Post('drivers/:id/attendance/adjust')
  @ApiOperation({ summary: 'تعديل حضور السائق' })
  async adjustAttendance(
    @Param('id') driverId: string,
    @Body()
    body: {
      date: string;
      checkIn?: string;
      checkOut?: string;
      reason: string;
    },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.adjustAttendance({
      driverId,
      data: body,
      adminId,
    });
  }

  // ==================== Driver Shifts ====================
  // ✅ تم نقل إدارة الورديات إلى ShiftController - استخدم /shifts

  // ==================== Driver Leave & Vacations ====================

  @Get('drivers/leave-requests')
  @ApiOperation({ summary: 'طلبات الإجازات' })
  async getLeaveRequests(
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getLeaveRequests(status, page, limit);
  }

  @Patch('drivers/leave-requests/:id/approve')
  @ApiOperation({ summary: 'الموافقة على طلب إجازة' })
  async approveLeaveRequest(
    @Param('id') requestId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.approveLeaveRequest(requestId, adminId);
  }

  @Patch('drivers/leave-requests/:id/reject')
  @ApiOperation({ summary: 'رفض طلب إجازة' })
  async rejectLeaveRequest(
    @Param('id') requestId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.rejectLeaveRequest(
      requestId,
      body.reason,
      adminId,
    );
  }

  @Get('drivers/:id/leave-balance')
  @ApiOperation({ summary: 'رصيد إجازات السائق' })
  async getDriverLeaveBalance(@Param('id') driverId: string) {
    return this.adminService.getDriverLeaveBalance(driverId);
  }

  @Patch('drivers/:id/leave-balance/adjust')
  @ApiOperation({ summary: 'تعديل رصيد الإجازات' })
  async adjustLeaveBalance(
    @Param('id') driverId: string,
    @Body() body: { days: number; type: 'add' | 'deduct' },
  ) {
    return this.adminService.adjustLeaveBalance(driverId, body.days, body.type);
  }

  // ==================== Quality & Reviews ====================
  // TODO: Implement Quality & Reviews Management

  @Get('quality/metrics')
  @ApiOperation({ summary: 'مقاييس الجودة' })
  async getQualityMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getQualityMetrics(startDate, endDate);
  }

  // ==================== Support Tickets ====================
  // ✅ تم نقل تذاكر الدعم إلى SupportController - استخدم /support/tickets

  // ==================== Settings ====================

  @Get('settings')
  @ApiOperation({ summary: 'إعدادات النظام' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'تحديث الإعدادات' })
  async updateSettings(@Body() body: any, @CurrentUser('id') adminId: string) {
    return this.adminService.updateSettings(body, adminId);
  }

  @Get('settings/feature-flags')
  @ApiOperation({ summary: 'أعلام الميزات' })
  async getFeatureFlags() {
    return this.adminService.getFeatureFlags();
  }

  @Patch('settings/feature-flags/:flag')
  @ApiOperation({ summary: 'تحديث علم ميزة' })
  async updateFeatureFlag(
    @Param('flag') flag: string,
    @Body() body: { enabled: boolean },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.updateFeatureFlag(flag, body.enabled, adminId);
  }

  // ==================== Backup System ====================

  @Post('backup/create')
  @ApiOperation({ summary: 'إنشاء نسخة احتياطية' })
  async createBackup(
    @Body() body: { collections?: string[]; description?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.createBackup(
      body.collections,
      body.description,
      adminId,
    );
  }

  @Get('backup/list')
  @ApiOperation({ summary: 'قائمة النسخ الاحتياطية' })
  async listBackups(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.listBackups(page, limit);
  }

  @Post('backup/:id/restore')
  @ApiOperation({ summary: 'استعادة نسخة احتياطية' })
  async restoreBackup(
    @Param('id') backupId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.restoreBackup(backupId, adminId);
  }

  @Get('backup/:id/download')
  @ApiOperation({ summary: 'تحميل نسخة احتياطية' })
  async downloadBackup(@Param('id') backupId: string) {
    return this.adminService.downloadBackup(backupId);
  }

  // ==================== Data Deletion ====================

  @Get('data-deletion/requests')
  @ApiOperation({ summary: 'طلبات حذف البيانات' })
  async getDataDeletionRequests(@Query('status') status?: string) {
    return this.adminService.getDataDeletionRequests(status);
  }

  @Patch('data-deletion/:id/approve')
  @ApiOperation({ summary: 'الموافقة على حذف البيانات' })
  async approveDataDeletion(
    @Param('id') requestId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.approveDataDeletion(requestId, adminId);
  }

  @Patch('data-deletion/:id/reject')
  @ApiOperation({ summary: 'رفض حذف البيانات' })
  async rejectDataDeletion(
    @Param('id') requestId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.rejectDataDeletion(
      requestId,
      body.reason,
      adminId,
    );
  }

  // ==================== Password Security ====================

  @Get('security/password-attempts')
  @ApiOperation({ summary: 'محاولات كلمات المرور الفاشلة' })
  async getFailedPasswordAttempts(@Query('threshold') threshold: number = 5) {
    return this.adminService.getFailedPasswordAttempts(threshold);
  }

  @Post('security/reset-password/:userId')
  @ApiOperation({ summary: 'إعادة تعيين كلمة مرور مستخدم' })
  async resetUserPassword(
    @Param('userId') userId: string,
    @Body() body: { tempPassword?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.resetUserPassword({
      userId,
      tempPassword: body.tempPassword,
      adminId,
    });
  }

  @Post('security/unlock-account/:userId')
  @ApiOperation({ summary: 'فتح حساب مقفل' })
  async unlockAccount(
    @Param('userId') userId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.unlockAccount({ userId, adminId });
  }

  // ==================== Activation Codes ====================
  // TODO: Implement Activation Codes Management

  // ==================== Marketer Management ====================

  @Get('marketers')
  @ApiOperation({ summary: 'جلب المسوقين الميدانيين' })
  async getAllMarketers(
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getAllMarketers({ status, page, limit });
  }

  @Get('marketers/:id')
  @ApiOperation({ summary: 'تفاصيل مسوق' })
  async getMarketerDetails(@Param('id') marketerId: string) {
    return this.adminService.getMarketerDetails(marketerId);
  }

  @Post('marketers')
  @ApiOperation({ summary: 'إضافة مسوق جديد' })
  async createMarketer(
    @Body()
    body: {
      fullName: string;
      phone: string;
      email?: string;
      territory?: string;
    },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.createMarketer(
      {
        name: body.fullName,
        email: body.email || '',
        phone: body.phone,
      },
      adminId,
    );
  }

  @Patch('marketers/:id')
  @ApiOperation({ summary: 'تحديث مسوق' })
  async updateMarketer(
    @Param('id') marketerId: string,
    @Body() body: any,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.updateMarketer({
      marketerId,
      updates: body as unknown,
      adminId,
    });
  }

  @Get('marketers/:id/performance')
  @ApiOperation({ summary: 'أداء المسوق' })
  async getMarketerPerformance(
    @Param('id') marketerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getMarketerPerformance(marketerId, {
      startDate,
      endDate,
    });
  }

  @Get('marketers/:id/stores')
  @ApiOperation({ summary: 'متاجر المسوق' })
  async getMarketerStores(@Param('id') marketerId: string) {
    return this.adminService.getMarketerStores(marketerId);
  }

  // ✅ تم نقل إدارة العمولات إلى FinanceController - استخدم /finance/commissions

  @Post('marketers/:id/activate')
  @ApiOperation({ summary: 'تفعيل مسوق' })
  async activateMarketer(
    @Param('id') marketerId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.activateMarketer({ marketerId, adminId });
  }

  @Post('marketers/:id/deactivate')
  @ApiOperation({ summary: 'تعطيل مسوق' })
  async deactivateMarketer(
    @Param('id') marketerId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.deactivateMarketer({
      marketerId,
      reason: body.reason,
      adminId,
    });
  }

  @Get('marketers/statistics')
  @ApiOperation({ summary: 'إحصائيات المسوقين' })
  async getMarketersStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getMarketersStatistics({ startDate, endDate });
  }

  @Get('marketers/export')
  @ApiOperation({ summary: 'تصدير المسوقين' })
  async exportMarketers() {
    return await this.adminService.exportMarketers();
  }

  // ==================== Onboarding Management ====================
  // ✅ تم نقل إدارة الانضمام إلى OnboardingController - استخدم /onboarding

  // ==================== Commission Plans ====================
  // ✅ تم نقل خطط العمولات إلى FinanceController - استخدم /finance/commission-plans

  // ==================== Admin Users Management ====================
  // TODO: Implement Admin Users Management

  // ==================== Audit Logs ====================

  @Get('audit-logs')
  @ApiOperation({ summary: 'سجلات المراجعة' })
  async getAuditLogs(
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getAuditLogs(action, userId, startDate, endDate);
  }

  @Get('audit-logs/:id')
  @ApiOperation({ summary: 'تفاصيل سجل مراجعة' })
  async getAuditLogDetails(@Param('id') logId: string) {
    return this.adminService.getAuditLogDetails(logId);
  }

  // ==================== System Health ====================

  @Get('system/health')
  @ApiOperation({ summary: 'صحة النظام' })
  getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('system/metrics')
  @ApiOperation({ summary: 'مقاييس النظام' })
  getSystemMetrics() {
    return this.adminService.getSystemMetrics();
  }

  // TODO: Implement getSystemErrors

  // ==================== Database Management ====================

  @Get('database/stats')
  @ApiOperation({ summary: 'إحصائيات قاعدة البيانات' })
  async getDatabaseStats() {
    return this.adminService.getDatabaseStats();
  }

  // TODO: Implement cleanupDatabase

  // ==================== Payments Management ====================
  // TODO: Implement Payments Management

  // ==================== Promotions Management ====================
  // TODO: Implement Promotions Management

  // ==================== Coupons Management ====================
  // TODO: Implement Coupons Management

  // ==================== Notifications Management ====================
  // TODO: Implement Notifications Management

  // ==================== Orders Advanced ====================

  @Get('orders/stats/by-city')
  @ApiOperation({ summary: 'الطلبات حسب المدينة' })
  async getOrdersByCity(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getOrdersByCity(startDate, endDate);
  }

  @Get('orders/stats/by-payment-method')
  @ApiOperation({ summary: 'الطلبات حسب طريقة الدفع' })
  async getOrdersByPaymentMethod() {
    return this.adminService.getOrdersByPaymentMethod();
  }

  // TODO: Implement getDisputedOrders
  // TODO: Implement resolveDispute

  // ==================== Drivers Advanced ====================
  // TODO: Implement Advanced Driver Statistics

  @Get('drivers/stats/by-status')
  @ApiOperation({ summary: 'السائقين حسب الحالة' })
  async getDriversByStatus() {
    return this.adminService.getDriversByStatus();
  }

  // ==================== Stores Advanced ====================
  // TODO: Implement Stores Advanced Features

  // ==================== Vendors Advanced ====================
  // TODO: Implement Vendors Advanced Features

  // ==================== Users Advanced ====================

  @Get('users/:id/orders-history')
  @ApiOperation({ summary: 'سجل طلبات المستخدم' })
  async getUserOrdersHistory(@Param('id') userId: string) {
    return this.adminService.getUserOrdersHistory(userId);
  }

  // TODO: Implement getUserWalletHistory
  // TODO: Implement adjustUserWallet

  // ==================== Reports Advanced ====================
  // TODO: Implement Advanced Reports

  // ==================== Analytics Dashboard ====================
  // TODO: Implement Analytics Dashboard

  // ==================== Content Management ====================
  // TODO: Implement Content Management System

  // ==================== Emergency Actions ====================
  // TODO: Implement Emergency Actions (System Pause/Resume)

  // ==================== Export & Import ====================
  // TODO: Implement Export & Import Data

  // ==================== Cache Management ====================

  @Post('cache/clear')
  @ApiOperation({ summary: 'مسح الكاش' })
  clearCache() {
    return this.adminService.clearCache();
  }

  @Get('cache/stats')
  @ApiOperation({ summary: 'إحصائيات الكاش' })
  getCacheStats() {
    return this.adminService.getCacheStats();
  }

  // ==================== Permissions & Roles ====================

  @Get('roles')
  @ApiOperation({ summary: 'الأدوار' })
  getRoles() {
    return this.adminService.getRoles();
  }

  @Post('roles')
  @ApiOperation({ summary: 'إنشاء دور' })
  createRole(@Body() _body: { name: string; permissions: string[] }) {
    return this.adminService.createRole(_body);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'تحديث دور' })
  updateRole() {
    return this.adminService.updateRole();
  }
}
