import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Marketer } from './entities/marketer.entity';
import { Onboarding } from './entities/onboarding.entity';
import { ReferralEvent } from './entities/referral-event.entity';
import { CommissionPlan } from './entities/commission-plan.entity';

@Injectable()
export class MarketerService {
  constructor(
    @InjectModel(Marketer.name) private marketerModel: Model<Marketer>,
    @InjectModel(Onboarding.name) private onboardingModel: Model<Onboarding>,
    @InjectModel(ReferralEvent.name) private referralEventModel: Model<ReferralEvent>,
    @InjectModel(CommissionPlan.name) private commissionPlanModel: Model<CommissionPlan>,
  ) {}

  // ==================== Marketers ====================

  async create(marketerData: any) {
    const marketer = await this.marketerModel.create(marketerData);
    return marketer;
  }

  async getAll() {
    const marketers = await this.marketerModel.find().sort({ createdAt: -1 });
    return { data: marketers, total: marketers.length };
  }

  async getById(marketerId: string) {
    const marketer = await this.marketerModel.findById(marketerId);
    if (!marketer) {
      throw new NotFoundException({ code: 'MARKETER_NOT_FOUND', userMessage: 'المسوق غير موجود' });
    }
    return marketer;
  }

  async update(marketerId: string, updates: any) {
    const marketer = await this.marketerModel.findByIdAndUpdate(marketerId, updates, { new: true });
    if (!marketer) {
      throw new NotFoundException({ code: 'MARKETER_NOT_FOUND', userMessage: 'المسوق غير موجود' });
    }
    return marketer;
  }

  // ==================== Performance ====================

  async getPerformance(marketerId: string, startDate?: string, endDate?: string) {
    // TODO: Aggregate from orders/onboardings
    return { onboardings: 0, activeStores: 0, revenue: 0, commissions: 0 };
  }

  // ==================== Stores ====================

  async getMyStores(marketerId: string) {
    const onboardings = await this.onboardingModel
      .find({
        marketer: new Types.ObjectId(marketerId),
        type: 'store',
        status: 'approved',
      })
      .select('storeName createdEntityId');

    // TODO: Populate actual store data
    return { data: onboardings, total: onboardings.length };
  }

  async getStoreDetails(storeId: string) {
    // TODO: Get from Store model
    return { store: {} };
  }

  // ==================== Vendors ====================

  async getMyVendors(marketerId: string) {
    const onboardings = await this.onboardingModel
      .find({
        marketer: new Types.ObjectId(marketerId),
        type: 'vendor',
        status: 'approved',
      })
      .select('storeName createdEntityId');

    return { data: onboardings, total: onboardings.length };
  }

  async getVendorDetails(vendorId: string) {
    // TODO: Get from Vendor model
    return { vendor: {} };
  }

  // ==================== Commissions ====================

  async getCommissions(marketerId: string) {
    // TODO: Get from commission transactions
    return { data: [], total: 0, totalAmount: 0 };
  }

  async getCommissionDetails(commissionId: string) {
    // TODO: Implement
    return { commission: {} };
  }

  // ==================== Admin Operations ====================

  async activate(marketerId: string, adminId: string) {
    const marketer = await this.marketerModel.findByIdAndUpdate(
      marketerId,
      { isActive: true, activatedBy: new Types.ObjectId(adminId), activatedAt: new Date() },
      { new: true },
    );

    if (!marketer) {
      throw new NotFoundException({ code: 'MARKETER_NOT_FOUND', userMessage: 'المسوق غير موجود' });
    }

    return { success: true, message: 'تم تفعيل المسوق', marketer };
  }

  async deactivate(marketerId: string, adminId: string) {
    const marketer = await this.marketerModel.findByIdAndUpdate(
      marketerId,
      { isActive: false, deactivatedBy: new Types.ObjectId(adminId), deactivatedAt: new Date() },
      { new: true },
    );

    if (!marketer) {
      throw new NotFoundException({ code: 'MARKETER_NOT_FOUND', userMessage: 'المسوق غير موجود' });
    }

    return { success: true, message: 'تم إلغاء تفعيل المسوق', marketer };
  }

  async adjustCommission(marketerId: string, adjustmentData: any, adminId: string) {
    // TODO: Implement commission adjustment
    return { success: true, message: 'تم تعديل العمولة' };
  }

  // ==================== Statistics ====================

  async getStatistics() {
    const [total, active, pending] = await Promise.all([
      this.marketerModel.countDocuments(),
      this.marketerModel.countDocuments({ isActive: true }),
      this.onboardingModel.countDocuments({ status: 'pending' }),
    ]);

    return { total, active, pending };
  }

  // ==================== Onboarding ====================

  async getApplications(marketerId?: string) {
    const query: any = {};
    if (marketerId) query.marketer = new Types.ObjectId(marketerId);

    const applications = await this.onboardingModel.find(query).sort({ createdAt: -1 });
    return { data: applications, total: applications.length };
  }

  async getApplicationDetails(applicationId: string) {
    const application = await this.onboardingModel.findById(applicationId).populate('marketer');
    if (!application) {
      throw new NotFoundException({ code: 'APPLICATION_NOT_FOUND', userMessage: 'الطلب غير موجود' });
    }
    return application;
  }

  async approveApplication(applicationId: string, adminId: string) {
    const application = await this.onboardingModel.findByIdAndUpdate(
      applicationId,
      { status: 'approved', approvedBy: new Types.ObjectId(adminId), approvedAt: new Date() },
      { new: true },
    );

    if (!application) {
      throw new NotFoundException({ code: 'APPLICATION_NOT_FOUND', userMessage: 'الطلب غير موجود' });
    }

    // TODO: Create actual store/vendor entity
    return { success: true, message: 'تم قبول الطلب', application };
  }

  async rejectApplication(applicationId: string, reason: string, adminId: string) {
    const application = await this.onboardingModel.findByIdAndUpdate(
      applicationId,
      {
        status: 'rejected',
        rejectedBy: new Types.ObjectId(adminId),
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
      { new: true },
    );

    if (!application) {
      throw new NotFoundException({ code: 'APPLICATION_NOT_FOUND', userMessage: 'الطلب غير موجود' });
    }

    return { success: true, message: 'تم رفض الطلب', application };
  }

  async getOnboardingStatistics() {
    const stats = await this.onboardingModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return { byStatus: stats, byType: [] };
  }

  // ==================== Files ====================

  async uploadFile(marketerId: string, fileData: any) {
    // TODO: Implement file storage
    return { success: true, fileId: 'file_' + Date.now() };
  }

  async getFiles(marketerId: string) {
    // TODO: Implement
    return { data: [] };
  }

  // ==================== Notifications ====================

  async getNotifications(marketerId: string) {
    // TODO: Get from Notification model
    return { data: [] };
  }

  // ==================== Export ====================

  async exportMarketers(format: string) {
    // TODO: Export to CSV/Excel
    return { success: true, url: '' };
  }

  // ==================== Additional Methods ====================

  async getMarketerEarnings(marketerId: string, startDate?: string, endDate?: string) {
    // TODO: Aggregate earnings from commission and bonus
    return { totalEarnings: 0, totalCommissions: 0, bonuses: 0, breakdown: [] };
  }

  async addBonus(marketerId: string, amount: number, reason: string, adminId: string) {
    // TODO: Add bonus to marketer wallet
    return { success: true, message: 'تم إضافة المكافأة', amount, reason };
  }

  async getMarketerReferrals(marketerId: string) {
    const referrals = await this.referralEventModel
      .find({ marketer: new Types.ObjectId(marketerId) })
      .sort({ createdAt: -1 })
      .limit(100);

    return { data: referrals, total: referrals.length };
  }

  async getLeaderboard(period: string) {
    // TODO: Aggregate top marketers by period
    return { data: [], period };
  }

  async getProfile(marketerId: string) {
    return this.getById(marketerId);
  }

  async updateProfile(marketerId: string, updates: any) {
    return this.update(marketerId, updates);
  }

  async createOnboarding(marketerId: string, onboardingData: any) {
    const onboarding = await this.onboardingModel.create({
      ...onboardingData,
      marketer: new Types.ObjectId(marketerId),
      status: 'pending',
    });
    return onboarding;
  }

  async getMyOnboardings(marketerId: string, status?: string) {
    const query: any = { marketer: new Types.ObjectId(marketerId) };
    if (status) query.status = status;
    
    const onboardings = await this.onboardingModel.find(query).sort({ createdAt: -1 });
    return { data: onboardings, total: onboardings.length };
  }

  async getOnboardingDetails(onboardingId: string) {
    return this.getApplicationDetails(onboardingId);
  }

  async quickOnboard(marketerId: string, data: any) {
    return this.createOnboarding(marketerId, { ...data, quickOnboard: true });
  }

  async generateReferralCode(marketerId: string) {
    const code = 'REF' + Math.random().toString(36).substr(2, 8).toUpperCase();
    await this.marketerModel.findByIdAndUpdate(marketerId, { referralCode: code });
    return { code };
  }

  async getMyReferrals(marketerId: string) {
    return this.getMarketerReferrals(marketerId);
  }

  async getReferralStatistics(marketerId: string) {
    // TODO: Aggregate referral stats
    return { total: 0, successful: 0, pending: 0 };
  }

  async getStorePerformance(storeId: string, startDate?: string, endDate?: string) {
    // TODO: Aggregate store performance
    return { orders: 0, revenue: 0, rating: 0 };
  }

  async getMyCommissions(marketerId: string, status?: string) {
    return this.getCommissions(marketerId);
  }

  async getCommissionStatistics(marketerId: string) {
    // TODO: Aggregate commission stats
    return { total: 0, pending: 0, paid: 0 };
  }

  async getPendingCommissions(marketerId: string) {
    return this.getCommissions(marketerId);
  }

  async getOverview(marketerId: string) {
    const [marketer, onboardings, referrals] = await Promise.all([
      this.getById(marketerId),
      this.onboardingModel.countDocuments({ marketer: new Types.ObjectId(marketerId) }),
      this.referralEventModel.countDocuments({ marketer: new Types.ObjectId(marketerId) }),
    ]);

    return {
      marketer,
      stats: {
        totalOnboardings: onboardings,
        totalReferrals: referrals,
        totalEarnings: 0,
      },
    };
  }

  async getTodayStatistics(marketerId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOnboardings = await this.onboardingModel.countDocuments({
      marketer: new Types.ObjectId(marketerId),
      createdAt: { $gte: today },
    });

    return { onboardings: todayOnboardings, earnings: 0 };
  }

  async getMonthStatistics(marketerId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthOnboardings = await this.onboardingModel.countDocuments({
      marketer: new Types.ObjectId(marketerId),
      createdAt: { $gte: startOfMonth },
    });

    return { onboardings: monthOnboardings, earnings: 0 };
  }

  async getEarnings(marketerId: string, startDate?: string, endDate?: string) {
    return this.getMarketerEarnings(marketerId, startDate, endDate);
  }

  async getEarningsBreakdown(marketerId: string) {
    // TODO: Aggregate earnings by type
    return { byType: [], byMonth: [] };
  }

  async markNotificationRead(notificationId: string) {
    // TODO: Mark notification as read
    return { success: true };
  }

  async getTerritoryStats(marketerId: string) {
    const marketer = await this.getById(marketerId);
    // TODO: Aggregate territory stats
    return { territory: (marketer as any).territory, stores: 0, earnings: 0 };
  }
}
