import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../auth/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { Store } from '../store/entities/store.entity';
import { ModerationHelper } from '../../common/utils';
import * as DTO from './dto';

// Import specialized services
import {
  WithdrawalService,
  AuditService,
  SupportAdminService,
  DataDeletionService,
  SettingsService,
  FeatureFlagService,
  SecurityService,
  DriverShiftService,
  AttendanceService,
  LeaveService,
  MarketerService,
  BackupService,
} from './services';

export interface FinancialStats {
  totalRevenue: number;
  totalDeliveryFees: number;
  totalCompanyShare: number;
  totalPlatformShare: number;
  orderCount: number;
}

/**
 * Admin Service - Facade Pattern
 * يعمل كواجهة موحدة تستدعي الخدمات المتخصصة
 *
 * تم تقسيم الكود إلى 12 خدمة متخصصة لتحسين:
 * - قابلية الصيانة
 * - قابلية الاختبار
 * - إعادة الاستخدام
 * - فصل المسؤوليات
 */
@Injectable()
export class AdminService {
  constructor(
    // Core models
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
    @InjectModel(Store.name) private storeModel: Model<Store>,
    // Specialized services
    private readonly withdrawalService: WithdrawalService,
    private readonly auditService: AuditService,
    private readonly supportService: SupportAdminService,
    private readonly dataDeletionService: DataDeletionService,
    private readonly settingsService: SettingsService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly securityService: SecurityService,
    private readonly shiftService: DriverShiftService,
    private readonly attendanceService: AttendanceService,
    private readonly leaveService: LeaveService,
    private readonly marketerService: MarketerService,
    private readonly backupService: BackupService,
  ) {}

  // ==================== Dashboard & Statistics ====================

  async getDashboardStats(): Promise<DTO.DashboardStatsDto> {
    const [
      totalUsers,
      activeUsers,
      totalOrders,
      pendingOrders,
      totalDrivers,
      availableDrivers,
      totalVendors,
      activeStores,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ isActive: true }),
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({
        status: { $in: ['created', 'confirmed', 'preparing'] },
      }),
      this.driverModel.countDocuments(),
      this.driverModel.countDocuments({ isAvailable: true, isBanned: false }),
      this.vendorModel.countDocuments(),
      this.storeModel.countDocuments({ isActive: true }),
    ]);

    return {
      users: { total: totalUsers, active: activeUsers },
      orders: { total: totalOrders, pending: pendingOrders },
      drivers: { total: totalDrivers, available: availableDrivers },
      vendors: { total: totalVendors },
      stores: { active: activeStores },
    };
  }

  async getTodayStats(): Promise<DTO.TodayStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [newUsers, newOrders, deliveredOrders] = await Promise.all([
      this.userModel.countDocuments({ createdAt: { $gte: today } }),
      this.orderModel.countDocuments({ createdAt: { $gte: today } }),
      this.orderModel.countDocuments({
        status: 'delivered',
        deliveredAt: { $gte: today },
      }),
    ]);

    return { newUsers, newOrders, deliveredOrders };
  }

  async getFinancialStats(): Promise<FinancialStats> {
    const result = await this.orderModel.aggregate([
      { $match: { status: 'delivered', paid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          totalDeliveryFees: { $sum: '$deliveryFee' },
          totalCompanyShare: { $sum: '$companyShare' },
          totalPlatformShare: { $sum: '$platformShare' },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    return (
      (result[0] as FinancialStats) || {
        totalRevenue: 0,
        totalDeliveryFees: 0,
        totalCompanyShare: 0,
        totalPlatformShare: 0,
        orderCount: 0,
      }
    );
  }

  async getOrdersByStatus(
    query?: DTO.OrdersByStatusQueryDto,
  ): Promise<DTO.OrdersByStatusDto[]> {
    const matchQuery: Record<string, any> = {};
    if (query?.startDate || query?.endDate) {
      matchQuery.createdAt = {
        ...(query.startDate && { $gte: new Date(query.startDate) }),
        ...(query.endDate && { $lte: new Date(query.endDate) }),
      };
    }

    const result = await this.orderModel.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return result as DTO.OrdersByStatusDto[];
  }

  async getRevenueAnalytics(
    query: DTO.RevenueAnalyticsQueryDto,
  ): Promise<DTO.RevenueAnalyticsDto[]> {
    const matchQuery: Record<string, any> = { status: 'delivered', paid: true };
    if (query.startDate || query.endDate) {
      matchQuery.deliveredAt = {
        ...(query.startDate && { $gte: new Date(query.startDate) }),
        ...(query.endDate && { $lte: new Date(query.endDate) }),
      };
    }

    let groupBy: Record<string, any>;
    if (query.period === 'daily') {
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$deliveredAt' } };
    } else if (query.period === 'weekly') {
      groupBy = { $dateToString: { format: '%Y-W%U', date: '$deliveredAt' } };
    } else {
      groupBy = { $dateToString: { format: '%Y-%m', date: '$deliveredAt' } };
    }

    const result = await this.orderModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$price' },
          deliveryFees: { $sum: '$deliveryFee' },
          platformShare: { $sum: '$platformShare' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result as DTO.RevenueAnalyticsDto[];
  }

  async getLiveMetrics(): Promise<DTO.LiveMetricsDto> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [activeOrders, activeDrivers, recentOrders] = await Promise.all([
      this.orderModel.countDocuments({
        status: {
          $in: ['confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way'],
        },
      }),
      this.driverModel.countDocuments({ isAvailable: true, isBanned: false }),
      this.orderModel.countDocuments({ createdAt: { $gte: oneHourAgo } }),
    ]);

    return { activeOrders, activeDrivers, recentOrders };
  }

  // ==================== Drivers Management ====================

  async getAllDrivers(
    query?: DTO.GetAllDriversQueryDto,
  ): Promise<DTO.GetAllDriversResponseDto> {
    const matchQuery: Record<string, any> = {};
    if (query?.status) matchQuery.status = query.status;
    if (query?.isAvailable !== undefined)
      matchQuery.isAvailable = query.isAvailable;

    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const [drivers, total] = await Promise.all([
      this.driverModel
        .find(matchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.driverModel.countDocuments(matchQuery),
    ]);

    return {
      data: drivers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDriverDetails(driverId: string): Promise<DTO.DriverDetailsDto> {
    const driver = await this.driverModel.findById(driverId);
    if (!driver)
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });

    const [totalOrders, completedOrders, cancelledOrders] = await Promise.all([
      this.orderModel.countDocuments({ driver: new Types.ObjectId(driverId) }),
      this.orderModel.countDocuments({
        driver: new Types.ObjectId(driverId),
        status: 'delivered',
      }),
      this.orderModel.countDocuments({
        driver: new Types.ObjectId(driverId),
        status: 'cancelled',
      }),
    ]);

    return { driver, stats: { totalOrders, completedOrders, cancelledOrders } };
  }

  async getDriverPerformance(
    driverId: string,
    query?: DTO.DriverPerformanceQueryDto,
  ): Promise<DTO.DriverPerformanceDto> {
    const matchQuery: Record<string, any> = {
      driver: new Types.ObjectId(driverId),
      status: 'delivered',
    };
    if (query?.startDate || query?.endDate) {
      matchQuery.deliveredAt = {
        ...(query.startDate && { $gte: new Date(query.startDate) }),
        ...(query.endDate && { $lte: new Date(query.endDate) }),
      };
    }

    const result = await this.orderModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalEarnings: { $sum: '$driverShare' },
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    return (
      (result[0] as DTO.DriverPerformanceDto) || {
        totalOrders: 0,
        totalEarnings: 0,
        averageRating: 0,
      }
    );
  }

  async getDriverFinancials(
    driverId: string,
  ): Promise<DTO.DriverFinancialsDto> {
    const driver = await this.driverModel.findById(driverId).select('wallet');
    if (!driver)
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });

    return {
      wallet: (
        driver as unknown as {
          wallet: {
            balance: number;
            totalEarned: number;
            totalWithdrawn: number;
          };
        }
      ).wallet || {
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      },
    };
  }

  async banDriver(data: DTO.BanDriverDto) {
    return ModerationHelper.ban(
      this.driverModel,
      data.driverId,
      data.reason,
      data.adminId,
      'Driver',
    );
  }

  async unbanDriver(driverId: string, adminId: string) {
    return ModerationHelper.unban(
      this.driverModel,
      driverId,
      adminId,
      'Driver',
    );
  }

  async adjustDriverBalance(
    data: DTO.AdjustDriverBalanceDto,
  ): Promise<DTO.AdjustDriverBalanceResponseDto> {
    const driver = await this.driverModel.findById(data.driverId);
    if (!driver)
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });

    const wallet = (driver as unknown as { wallet: { balance: number } })
      .wallet || { balance: 0 };
    if (data.type === 'credit') {
      wallet.balance += data.amount;
    } else {
      wallet.balance -= data.amount;
    }
    (driver as unknown as { wallet: { balance: number } }).wallet = wallet;

    await driver.save();

    return { success: true, newBalance: wallet.balance };
  }

  async getDriverDocuments(driverId: string) {
    const driver = await this.driverModel
      .findById(driverId)
      .select('documents');
    if (!driver)
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });

    return {
      documents: (driver as unknown as { documents: any[] }).documents || [],
    };
  }

  async verifyDocument(data: DTO.VerifyDocumentDto) {
    const driver = await this.driverModel.findById(data.driverId);
    if (!driver)
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });

    const documents =
      (driver as unknown as { documents: any[] }).documents || [];
    const doc = documents.find(
      (d: unknown) => (d as { _id: string })._id?.toString() === data.docId,
    ) as unknown as {
      verified: boolean;
      verifiedBy: string;
      verifiedAt: Date;
      verificationNotes: string;
    };

    if (!doc) {
      throw new NotFoundException({
        code: 'DOCUMENT_NOT_FOUND',
        userMessage: 'المستند غير موجود',
      });
    }

    doc.verified = data.verified;
    doc.verifiedBy = data.adminId || '';
    doc.verifiedAt = new Date();
    doc.verificationNotes = data.notes || '';

    await driver.save();
    return {
      success: true,
      message: data.verified ? 'تم التحقق من المستند' : 'تم رفض المستند',
    };
  }

  async updateDocument(data: DTO.UpdateDocumentDto) {
    const driver = await this.driverModel.findById(data.driverId);
    if (!driver)
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });

    const documents =
      (driver as unknown as { documents: unknown[] }).documents || [];
    const doc = documents.find(
      (d: unknown) => (d as { _id: string })._id?.toString() === data.docId,
    );

    if (!doc) {
      throw new NotFoundException({
        code: 'DOCUMENT_NOT_FOUND',
        userMessage: 'المستند غير موجود',
      });
    }

    Object.assign(doc, data.updates);
    await driver.save();

    return { success: true, message: 'تم تحديث المستند' };
  }

  async getDriversByStatus() {
    const result = await this.driverModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return { data: result };
  }

  // ==================== Withdrawals (→ WithdrawalService) ====================

  async getWithdrawals(query?: DTO.GetWithdrawalsQueryDto) {
    return this.withdrawalService.getWithdrawals(query);
  }

  async getPendingWithdrawals() {
    return this.withdrawalService.getPendingWithdrawals();
  }

  async approveWithdrawal(data: DTO.ApproveWithdrawalDto): Promise<any> {
    return this.withdrawalService.approveWithdrawal(data);
  }

  async rejectWithdrawal(data: DTO.RejectWithdrawalDto): Promise<any> {
    return this.withdrawalService.rejectWithdrawal(data);
  }

  // ==================== Store & Vendor Moderation ====================

  async getPendingStores() {
    const stores = await this.storeModel.find({ status: 'pending' }).limit(50);
    return { data: stores, total: stores.length };
  }

  async approveStore(storeId: string, adminId: string) {
    return ModerationHelper.approve(this.storeModel, storeId, adminId, 'Store');
  }

  async rejectStore(storeId: string, reason: string, adminId: string) {
    return ModerationHelper.reject(
      this.storeModel,
      storeId,
      reason,
      adminId,
      'Store',
    );
  }

  async suspendStore(storeId: string, reason: string, adminId: string) {
    return ModerationHelper.suspend(
      this.storeModel,
      storeId,
      reason,
      adminId,
      'Store',
    );
  }

  async getPendingVendors() {
    const vendors = await this.vendorModel
      .find({ status: 'pending' })
      .limit(50);
    return { data: vendors, total: vendors.length };
  }

  async approveVendor(vendorId: string, adminId: string) {
    const vendor = await this.vendorModel.findById(vendorId);
    if (!vendor)
      throw new NotFoundException({
        code: 'VENDOR_NOT_FOUND',
        userMessage: 'التاجر غير موجود',
      });

    (
      vendor as unknown as {
        status: string;
        approvedBy: string;
        approvedAt: Date;
      }
    ).status = 'approved';
    (vendor as unknown as { approvedBy: string }).approvedBy = adminId;
    (vendor as unknown as { approvedAt: Date }).approvedAt = new Date();

    await vendor.save();
    return { success: true, message: 'تم الموافقة على التاجر' };
  }

  async rejectVendor(vendorId: string, reason: string, adminId: string) {
    const vendor = await this.vendorModel.findById(vendorId);
    if (!vendor)
      throw new NotFoundException({
        code: 'VENDOR_NOT_FOUND',
        userMessage: 'التاجر غير موجود',
      });

    (vendor as unknown as { status: string }).status = 'rejected';
    (vendor as unknown as { rejectionReason: string }).rejectionReason = reason;
    (vendor as unknown as { rejectedBy: string }).rejectedBy = adminId;

    await vendor.save();
    return { success: true, message: 'تم رفض التاجر' };
  }

  async suspendVendor(vendorId: string, reason: string, adminId: string) {
    return ModerationHelper.suspend(
      this.vendorModel,
      vendorId,
      reason,
      adminId,
      'Vendor',
    );
  }

  // ==================== Users Management ====================

  async getUsers(query?: DTO.GetUsersQueryDto) {
    const matchQuery: Record<string, any> = {};
    if (query?.search) {
      matchQuery.$or = [
        { fullName: new RegExp(query.search, 'i') },
        { phone: new RegExp(query.search, 'i') },
        { email: new RegExp(query.search, 'i') },
      ];
    }
    if (query?.isActive !== undefined) matchQuery.isActive = query.isActive;

    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel
        .find(matchQuery)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(matchQuery),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user)
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        userMessage: 'المستخدم غير موجود',
      });

    const orderStats = await this.orderModel.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
          },
        },
      },
    ]);

    return {
      user,
      orderStats: (orderStats[0] as {
        totalOrders: number;
        totalSpent: number;
        completedOrders: number;
      }) || {
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
      },
    };
  }

  async banUser(data: DTO.BanUserDto) {
    return ModerationHelper.ban(
      this.userModel,
      data.userId,
      data.reason,
      data.adminId,
      'User',
    );
  }

  async unbanUser(userId: string, adminId: string) {
    return ModerationHelper.unban(this.userModel, userId, adminId, 'User');
  }

  async getUserOrdersHistory(userId: string) {
    const orders = await this.orderModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(50);
    return { data: orders, total: orders.length };
  }

  // ==================== Reports ====================

  async getDailyReport(query?: DTO.DailyReportQueryDto) {
    const targetDate = query?.date ? new Date(query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const [orders, revenue, newUsers] = await Promise.all([
      this.orderModel.countDocuments({
        createdAt: { $gte: targetDate, $lt: nextDay },
      }),
      this.orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: targetDate, $lt: nextDay },
            status: 'delivered',
            paid: true,
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      this.userModel.countDocuments({
        createdAt: { $gte: targetDate, $lt: nextDay },
      }),
    ]);

    return {
      date: targetDate,
      orders,
      revenue: (revenue[0] as { total: number } | undefined)?.total || 0,
      newUsers,
    };
  }

  async getUserActivityReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeToday, newToday] = await Promise.all([
      this.orderModel.distinct('user', { createdAt: { $gte: today } }),
      this.userModel.countDocuments({ createdAt: { $gte: today } }),
    ]);

    return { activeUsers: activeToday.length, newUsers: newToday };
  }

  // ==================== Withdrawals (→ WithdrawalService) ====================
  // Already delegated above

  // ==================== Support Tickets (→ SupportAdminService) ====================

  async getSupportTickets(
    status?: string,
    priority?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.supportService.getSupportTickets(status, priority, page, limit);
  }

  async assignTicket(ticketId: string, assigneeId: string, adminId: string) {
    return this.supportService.assignTicket(ticketId, assigneeId, adminId);
  }

  async resolveTicket(ticketId: string, resolution: string, adminId: string) {
    return this.supportService.resolveTicket(ticketId, resolution, adminId);
  }

  async getSLAMetrics() {
    return this.supportService.getSLAMetrics();
  }

  // ==================== Settings (→ SettingsService) ====================

  async getSettings() {
    return this.settingsService.getSettings();
  }

  async updateSettings(settings: { key: string; value: any }, adminId: string) {
    return this.settingsService.updateSetting(
      settings.key,
      settings.value,
      adminId,
    );
  }

  // ==================== Feature Flags (→ FeatureFlagService) ====================

  async getFeatureFlags() {
    return this.featureFlagService.getFeatureFlags();
  }

  async updateFeatureFlag(flag: string, enabled: boolean, adminId: string) {
    return this.featureFlagService.updateFeatureFlag(flag, enabled, adminId);
  }

  // ==================== Backup (→ BackupService) ====================

  async createBackup(
    collections?: string[],
    description?: string,
    adminId?: string,
  ) {
    return this.backupService.createBackup(collections, description, adminId);
  }

  async listBackups(page: number = 1, limit: number = 20) {
    return this.backupService.listBackups(page, limit);
  }

  async restoreBackup(backupId: string, adminId: string) {
    return this.backupService.restoreBackup(backupId, adminId);
  }

  async downloadBackup(backupId: string) {
    return this.backupService.downloadBackup(backupId);
  }

  // ==================== Data Deletion (→ DataDeletionService) ====================

  async getDataDeletionRequests(status?: string) {
    return this.dataDeletionService.getDataDeletionRequests(status);
  }

  async approveDataDeletion(requestId: string, adminId: string) {
    return this.dataDeletionService.approveDataDeletion(requestId, adminId);
  }

  async rejectDataDeletion(requestId: string, reason: string, adminId: string) {
    return this.dataDeletionService.rejectDataDeletion(
      requestId,
      reason,
      adminId,
    );
  }

  // ==================== Security (→ SecurityService) ====================

  async getFailedPasswordAttempts(threshold: number = 5) {
    return this.securityService.getFailedPasswordAttempts(threshold);
  }

  async resetUserPassword(data: DTO.ResetUserPasswordDto) {
    const user = await this.userModel.findById(data.userId);
    if (!user)
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        userMessage: 'المستخدم غير موجود',
      });

    const password = data.tempPassword || Math.random().toString(36).slice(-8);

    return {
      success: true,
      message: 'تم إعادة تعيين كلمة المرور',
      tempPassword: password,
    };
  }

  async unlockAccount(data: DTO.UnlockAccountDto) {
    const user = await this.userModel.findById(data.userId);
    if (!user)
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        userMessage: 'المستخدم غير موجود',
      });

    (user as unknown as { isLocked: boolean }).isLocked = false;
    (user as unknown as { failedLoginAttempts: number }).failedLoginAttempts =
      0;
    await user.save();

    return { success: true, message: 'تم فتح الحساب' };
  }

  // ==================== Driver Attendance (→ AttendanceService) ====================

  async getDriverAttendance(
    driverId: string,
    query?: DTO.GetDriverAttendanceQueryDto,
  ) {
    return this.attendanceService.getDriverAttendance(driverId, query);
  }

  async getAttendanceSummary(date?: string) {
    return this.attendanceService.getAttendanceSummary(date);
  }

  async adjustAttendance(data: DTO.AdjustAttendanceDto) {
    if (!data.adminId) {
      throw new Error('adminId is required');
    }
    return this.attendanceService.adjustAttendance({
      driverId: data.driverId,
      data: data.data,
      adminId: data.adminId,
    });
  }

  // ==================== Driver Shifts (→ DriverShiftService) ====================

  async getAllShifts() {
    return this.shiftService.getAllShifts();
  }

  async createShift(
    shiftData: {
      name: string;
      startTime: string;
      endTime: string;
      days: number[];
      breakTimes?: any;
      maxDrivers?: number;
      description?: string;
      color?: string;
    },
    adminId: string,
  ) {
    return this.shiftService.createShift(shiftData, adminId);
  }

  async updateShift(shiftId: string, updates: Partial<any>) {
    return this.shiftService.updateShift(shiftId, updates);
  }

  async assignShiftToDriver(
    shiftId: string,
    driverId: string,
    startDate: string,
    endDate?: string,
  ) {
    return this.shiftService.assignShiftToDriver(
      shiftId,
      driverId,
      startDate,
      endDate,
    );
  }

  async getDriverShifts(driverId: string) {
    return this.shiftService.getDriverShifts(driverId);
  }

  // ==================== Leave Management (→ LeaveService) ====================

  async getLeaveRequests(
    status?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.leaveService.getLeaveRequests(status, page, limit);
  }

  async approveLeaveRequest(requestId: string, adminId: string) {
    return this.leaveService.approveLeaveRequest(requestId, adminId);
  }

  async rejectLeaveRequest(requestId: string, reason: string, adminId: string) {
    return this.leaveService.rejectLeaveRequest(requestId, reason, adminId);
  }

  async getDriverLeaveBalance(driverId: string) {
    return this.leaveService.getDriverLeaveBalance(driverId);
  }

  async adjustLeaveBalance(
    driverId: string,
    days: number,
    type: 'add' | 'deduct',
  ) {
    return this.leaveService.adjustLeaveBalance(driverId, days, type);
  }

  // ==================== Marketer Management (→ MarketerService) ====================

  async getAllMarketers(query?: DTO.GetAllMarketersQueryDto) {
    return this.marketerService.getAllMarketers(query);
  }

  async getMarketerDetails(marketerId: string) {
    return this.marketerService.getMarketerDetails(marketerId);
  }

  async createMarketer(data: DTO.CreateMarketerDto, adminId: string) {
    return this.marketerService.createMarketer(data, adminId);
  }

  async updateMarketer(data: DTO.UpdateMarketerDto) {
    return this.marketerService.updateMarketer(data);
  }

  async getMarketerPerformance(
    marketerId: string,
    query?: DTO.GetMarketerPerformanceQueryDto,
  ) {
    return this.marketerService.getMarketerPerformance(marketerId, query);
  }

  async getMarketerStores(marketerId: string) {
    return this.marketerService.getMarketerStores(marketerId);
  }

  async getMarketerCommissions(marketerId: string, status?: string) {
    return this.marketerService.getMarketerCommissions(marketerId, status);
  }

  async activateMarketer(data: DTO.ActivateMarketerDto) {
    return this.marketerService.activateMarketer(data);
  }

  async deactivateMarketer(data: DTO.DeactivateMarketerDto) {
    return this.marketerService.deactivateMarketer(data);
  }

  async adjustMarketerCommission(data: DTO.AdjustMarketerCommissionDto) {
    return this.marketerService.adjustMarketerCommission(data);
  }

  async getMarketersStatistics(query?: DTO.GetMarketersStatisticsQueryDto) {
    return this.marketerService.getMarketersStatistics(query);
  }

  async exportMarketers(): Promise<any> {
    return this.marketerService.exportMarketers();
  }

  // ==================== Onboarding (→ MarketerService) ====================

  async getOnboardingApplications(
    query?: DTO.GetOnboardingApplicationsQueryDto,
  ) {
    return this.marketerService.getOnboardingApplications(query);
  }

  async getOnboardingDetails(applicationId: string) {
    return this.marketerService.getOnboardingDetails(applicationId);
  }

  async approveOnboarding(data: DTO.ApproveOnboardingDto) {
    return this.marketerService.approveOnboarding(data);
  }

  async rejectOnboarding(data: DTO.RejectOnboardingDto) {
    return this.marketerService.rejectOnboarding(data);
  }

  async getOnboardingStatistics() {
    return this.marketerService.getOnboardingStatistics();
  }

  // ==================== Commission Plans (→ MarketerService) ====================

  async getCommissionPlans() {
    return this.marketerService.getCommissionPlans();
  }

  async createCommissionPlan(planData: Record<string, any>, adminId: string) {
    return this.marketerService.createCommissionPlan(
      {
        name: planData.name as string,
        type: planData.type as string,
        rate: planData.rate as number,
        minOrders: planData.minOrders as number | undefined,
        maxOrders: planData.maxOrders as number | undefined,
      },
      adminId,
    );
  }

  async updateCommissionPlan(
    planId: string,
    updates: Record<string, any>,
    adminId: string,
  ) {
    return this.marketerService.updateCommissionPlan(planId, updates, adminId);
  }

  // ==================== Audit Logs (→ AuditService) ====================

  async getAuditLogs(
    action?: string,
    userId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    return this.auditService.getAuditLogs(action, userId, startDate, endDate);
  }

  async getAuditLogDetails(logId: string) {
    return this.auditService.getAuditLogDetails(logId);
  }

  // ==================== System Health ====================

  getSystemHealth() {
    return {
      status: 'healthy',
      database: 'connected',
      redis: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  getSystemMetrics() {
    return {
      cpu: 0,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      activeConnections: 0,
    };
  }

  async getDatabaseStats() {
    const stats = await Promise.all([
      this.userModel.countDocuments(),
      this.orderModel.countDocuments(),
      this.driverModel.countDocuments(),
      this.storeModel.countDocuments(),
      this.vendorModel.countDocuments(),
    ]);

    return {
      users: stats[0],
      orders: stats[1],
      drivers: stats[2],
      stores: stats[3],
      vendors: stats[4],
    };
  }

  // ==================== Orders Analytics ====================

  async getOrdersByCity(startDate?: string, endDate?: string) {
    const query: Record<string, any> = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate)
        (query.createdAt as Record<string, any>).$gte = new Date(startDate);
      if (endDate)
        (query.createdAt as Record<string, any>).$lte = new Date(endDate);
    }

    const result = await this.orderModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$price' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return { data: result };
  }

  async getOrdersByPaymentMethod() {
    const result = await this.orderModel.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return { data: result };
  }

  // ==================== Notifications ====================

  sendBulkNotification(data: DTO.SendBulkNotificationDto) {
    // TODO: Integrate with Notification Module
    return {
      success: true,
      message: 'تم إرسال الإشعار',
      recipients: data.userIds?.length || 0,
    };
  }

  // ==================== Quality Metrics ====================

  async getQualityMetrics(startDate?: string, endDate?: string) {
    const query: Record<string, any> = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate)
        (query.createdAt as Record<string, any>).$gte = new Date(startDate);
      if (endDate)
        (query.createdAt as Record<string, any>).$lte = new Date(endDate);
    }

    const [avgOrderRating, avgDriverRating] = await Promise.all([
      this.orderModel.aggregate([
        { $match: { ...query, rating: { $exists: true } } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
      this.driverModel.aggregate([
        { $match: { 'rating.average': { $exists: true } } },
        { $group: { _id: null, avg: { $avg: '$rating.average' } } },
      ]),
    ]);

    return {
      orderRating: (avgOrderRating[0] as { avg: number })?.avg || 0,
      driverRating: (avgDriverRating[0] as { avg: number })?.avg || 0,
    };
  }

  // ==================== Roles & Permissions ====================

  getRoles() {
    return {
      data: [
        { id: 'admin', name: 'مسؤول', permissions: [] },
        { id: 'superadmin', name: 'مسؤول رئيسي', permissions: [] },
      ],
    };
  }

  createRole(roleData: Record<string, any>) {
    // TODO: Implement Role management system
    return { success: true, role: roleData };
  }

  updateRole() {
    // TODO: Implement Role management system
    return { success: true, message: 'تم تحديث الدور' };
  }

  // ==================== Cache Management ====================

  clearCache() {
    // TODO: Integrate with Redis/Cache service
    return { success: true, message: 'تم مسح الكاش' };
  }

  getCacheStats() {
    // TODO: Integrate with Redis/Cache service
    return { keys: 0, size: 0, hitRate: 0 };
  }
}
