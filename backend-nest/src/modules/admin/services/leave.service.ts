import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LeaveRequest } from '../../er/entities/leave-request.entity';
import { Driver } from '../../driver/entities/driver.entity';
import {
  DriverWithWallet,
  LeaveRequestDocument,
  DriverLeaveBalance,
} from '../interfaces/admin.interfaces';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(LeaveRequest.name)
    private leaveRequestModel: Model<LeaveRequest>,
    @InjectModel(Driver.name)
    private driverModel: Model<Driver>,
  ) {}

  async getLeaveRequests(
    status?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const matchQuery: {
      employeeModel: string;
      status?: string;
    } = {
      employeeModel: 'Driver',
    };

    if (status) {
      matchQuery.status = status;
    }

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      this.leaveRequestModel
        .find(matchQuery)
        .populate('employeeId', 'fullName phone')
        .populate('approvedBy', 'fullName')
        .populate('rejectedBy', 'fullName')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.leaveRequestModel.countDocuments(matchQuery),
    ]);

    return {
      data: requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveLeaveRequest(
    requestId: string,
    adminId: string,
  ): Promise<{ success: boolean; message: string }> {
    const request = await this.leaveRequestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException({
        code: 'LEAVE_REQUEST_NOT_FOUND',
        userMessage: 'طلب الإجازة غير موجود',
      });
    }

    const leaveDoc = request as unknown as LeaveRequestDocument;

    if (leaveDoc.status !== 'pending') {
      throw new BadRequestException({
        code: 'REQUEST_ALREADY_PROCESSED',
        userMessage: 'تم معالجة الطلب بالفعل',
      });
    }

    // Check if driver has enough leave balance
    const driver = await this.driverModel.findById(leaveDoc.employeeId);
    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });
    }

    // Update request
    leaveDoc.status = 'approved';
    leaveDoc.approvedBy = new Types.ObjectId(adminId);
    leaveDoc.approvedAt = new Date();

    await request.save();

    // TODO: Deduct from driver leave balance
    // TODO: Send notification

    return {
      success: true,
      message: 'تم الموافقة على الإجازة',
    };
  }

  async rejectLeaveRequest(
    requestId: string,
    reason: string,
    adminId: string,
  ): Promise<{ success: boolean; message: string }> {
    const request = await this.leaveRequestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException({
        code: 'LEAVE_REQUEST_NOT_FOUND',
        userMessage: 'طلب الإجازة غير موجود',
      });
    }

    const leaveDoc = request as unknown as LeaveRequestDocument;
    leaveDoc.status = 'rejected';
    leaveDoc.rejectionReason = reason;
    leaveDoc.rejectedBy = new Types.ObjectId(adminId);
    leaveDoc.rejectedAt = new Date();

    await request.save();

    // TODO: Send notification

    return {
      success: true,
      message: 'تم رفض الإجازة',
    };
  }

  async getDriverLeaveBalance(driverId: string) {
    const driver = await this.driverModel.findById(driverId);
    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });
    }

    // Calculate used leave days from approved requests
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    const approvedLeaves = await this.leaveRequestModel.find({
      employeeId: new Types.ObjectId(driverId),
      employeeModel: 'Driver',
      status: 'approved',
      startDate: { $gte: yearStart, $lte: yearEnd },
    });

    let usedDays = 0;
    for (const leave of approvedLeaves) {
      const leaveDoc = leave as unknown as LeaveRequestDocument;
      const days = Math.ceil(
        (leaveDoc.endDate.getTime() - leaveDoc.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      usedDays += days;
    }

    // Default balances (can be customized per driver)
    const driverWithBalance = driver as unknown as DriverWithWallet;
    const annualLeave = driverWithBalance.leaveBalance?.annual || 21;
    const sickLeave = driverWithBalance.leaveBalance?.sick || 10;

    return {
      annual: annualLeave,
      sick: sickLeave,
      emergency: 5,
      used: usedDays,
      remaining: annualLeave - usedDays,
    };
  }

  async adjustLeaveBalance(
    driverId: string,
    days: number,
    type: 'add' | 'deduct',
  ) {
    const driver = await this.driverModel.findById(driverId);
    if (!driver) {
      throw new NotFoundException({
        code: 'DRIVER_NOT_FOUND',
        userMessage: 'السائق غير موجود',
      });
    }

    const driverWithBalance = driver as unknown as DriverWithWallet;
    const leaveBalance: DriverLeaveBalance = driverWithBalance.leaveBalance || {
      annual: 21,
      sick: 10,
    };

    if (type === 'add') {
      leaveBalance.annual += days;
    } else {
      leaveBalance.annual -= days;
    }

    driverWithBalance.leaveBalance = leaveBalance;
    await driver.save();

    // TODO: Log in audit trail

    return {
      success: true,
      message: 'تم تعديل رصيد الإجازات',
      newBalance: leaveBalance.annual,
    };
  }
}
