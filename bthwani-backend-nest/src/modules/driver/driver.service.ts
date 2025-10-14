import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import {
  PaginationHelper,
  EntityHelper,
  SanitizationHelper,
} from '../../common/utils';

@Injectable()
export class DriverService {
  constructor(@InjectModel(Driver.name) private driverModel: Model<Driver>) {}

  // إنشاء سائق جديد
  async create(createDriverDto: CreateDriverDto) {
    // التحقق من وجود السائق
    const existing = await this.driverModel.findOne({
      $or: [{ email: createDriverDto.email }, { phone: createDriverDto.phone }],
    });

    if (existing) {
      throw new ConflictException({
        code: 'DRIVER_EXISTS',
        message: 'Driver already exists',
        userMessage: 'السائق موجود مسبقاً',
        suggestedAction: 'يرجى استخدام بريد أو هاتف مختلف',
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(createDriverDto.password, 10);

    // إنشاء السائق
    const driver = await this.driverModel.create({
      ...createDriverDto,
      password: hashedPassword,
    });

    return SanitizationHelper.sanitize<Driver>(driver);
  }

  // جلب كل السائقين المتاحين
  async findAvailable(pagination: CursorPaginationDto) {
    const result = await PaginationHelper.paginate(
      this.driverModel,
      { isAvailable: true, isBanned: false },
      pagination,
    );

    return {
      ...result,
      data: SanitizationHelper.sanitizeMany<Driver>(result.data),
    };
  }

  // جلب سائق محدد
  async findOne(id: string) {
    const driver = await EntityHelper.findByIdOrFail(
      this.driverModel,
      id,
      'Driver',
    );

    return SanitizationHelper.sanitize<Driver>(driver);
  }

  // تحديث الموقع الحالي
  async updateLocation(driverId: string, locationDto: UpdateLocationDto) {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      {
        currentLocation: {
          lat: locationDto.lat,
          lng: locationDto.lng,
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        message: 'Driver not found',
        userMessage: 'السائق غير موجود',
      });
    }

    return SanitizationHelper.sanitize<Driver>(driver);
  }

  // تحديث حالة التوفر
  async updateAvailability(driverId: string, isAvailable: boolean) {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      { isAvailable },
      { new: true },
    );

    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        message: 'Driver not found',
        userMessage: 'السائق غير موجود',
      });
    }

    return SanitizationHelper.sanitize<Driver>(driver);
  }

  // تحديث إحصائيات التوصيل
  async updateDeliveryStats(driverId: string, delivered: boolean = true) {
    const updateField = delivered
      ? 'deliveryStats.deliveredCount'
      : 'deliveryStats.canceledCount';

    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      { $inc: { [updateField]: 1 } },
      { new: true },
    );

    return SanitizationHelper.sanitize<Driver>(driver);
  }

  // تم استبدال هذه الدالة بـ SanitizationHelper
  // private sanitizeDriver - Removed (now using SanitizationHelper)

  // ==================== Profile Management ====================

  async getProfile(driverId: string) {
    return this.findOne(driverId);
  }

  async updateProfile(driverId: string, updates: any) {
    const driver = await this.driverModel.findByIdAndUpdate(driverId, updates, { new: true }).select('-password');
    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        message: 'Driver not found',
        userMessage: 'السائق غير موجود',
      });
    }
    return SanitizationHelper.sanitize<Driver>(driver);
  }

  // ==================== Earnings ====================

  async getEarnings(driverId: string, startDate?: string, endDate?: string) {
    // TODO: Aggregate from Order model
    return { totalEarnings: 0, ordersCount: 0, averagePerOrder: 0 };
  }

  async getDailyEarnings(driverId: string) {
    // TODO: Today's earnings
    return { earnings: 0, ordersCount: 0 };
  }

  async getWeeklyEarnings(driverId: string) {
    // TODO: This week's earnings
    return { earnings: 0, ordersCount: 0 };
  }

  async getStatistics(driverId: string) {
    // TODO: Aggregate statistics
    return { totalOrders: 0, completedOrders: 0, cancelledOrders: 0, totalEarnings: 0, averageRating: 0 };
  }

  // ==================== Documents ====================

  async uploadDocument(driverId: string, docData: any) {
    const driver = await this.driverModel.findById(driverId);
    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        message: 'Driver not found',
        userMessage: 'السائق غير موجود',
      });
    }

    const documents = (driver as any).documents || [];
    documents.push({ ...docData, uploadedAt: new Date(), verified: false });
    (driver as any).documents = documents;
    await driver.save();

    return { success: true, message: 'تم رفع المستند' };
  }

  async getDocuments(driverId: string) {
    const driver = await this.driverModel.findById(driverId).select('documents');
    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        message: 'Driver not found',
        userMessage: 'السائق غير موجود',
      });
    }
    return { documents: (driver as any).documents || [] };
  }

  // ==================== Vacations ====================

  async requestVacation(driverId: string, vacationData: any) {
    // TODO: Implement VacationRequest model
    return { success: true, message: 'تم تقديم طلب الإجازة', requestId: 'vacation_' + Date.now() };
  }

  async getMyVacations(driverId: string) {
    // TODO: Implement
    return { data: [] };
  }

  async cancelVacation(vacationId: string, driverId: string) {
    // TODO: Implement
    return { success: true, message: 'تم إلغاء طلب الإجازة' };
  }

  async getVacationBalance(driverId: string) {
    // TODO: Implement
    return { annual: 30, sick: 15, used: 0, remaining: 30 };
  }

  async getVacationPolicy() {
    return { annualLeave: 30, sickLeave: 15, emergencyLeave: 5, rules: 'يجب التقديم قبل 7 أيام' };
  }

  // ==================== Withdrawals ====================

  async requestWithdrawal(driverId: string, amount: number, method: string, accountInfo: any) {
    // TODO: Implement
    return { success: true, message: 'تم تقديم طلب السحب', requestId: 'withdrawal_' + Date.now() };
  }

  async getMyWithdrawals(driverId: string) {
    // TODO: Implement
    return { data: [] };
  }

  async getWithdrawalStatus(withdrawalId: string, driverId: string) {
    // TODO: Implement
    return { status: 'pending', amount: 0 };
  }

  // ==================== Orders (Advanced) ====================

  async getAvailableOrders(driverId: string) {
    // TODO: Find orders that need drivers (nearby, unassigned)
    return { data: [] };
  }

  async acceptOrder(orderId: string, driverId: string) {
    // TODO: Assign order to driver
    return { success: true, message: 'تم قبول الطلب' };
  }

  async rejectOrder(orderId: string, driverId: string, reason: string) {
    // TODO: Implement
    return { success: true, message: 'تم رفض الطلب' };
  }

  async startDelivery(orderId: string, driverId: string) {
    // TODO: Update order status
    return { success: true, message: 'بدأ التوصيل' };
  }

  async completeDelivery(orderId: string, driverId: string) {
    // TODO: Update order status to delivered
    return { success: true, message: 'تم إتمام التوصيل' };
  }

  async getOrdersHistory(driverId: string, pagination: any) {
    // TODO: Find driver's past orders
    return { data: [], pagination: { nextCursor: null, hasMore: false, limit: 20 } };
  }

  async reportIssue(driverId: string, issueData: any) {
    // TODO: Create issue/support ticket
    return { success: true, message: 'تم الإبلاغ عن المشكلة', issueId: 'issue_' + Date.now() };
  }
}

