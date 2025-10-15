import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name)
    private auditLogModel: Model<AuditLog>,
  ) {}

  async getAuditLogs(
    action?: string,
    userId?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const matchQuery: {
      action?: RegExp;
      userId?: Types.ObjectId;
      createdAt?: { $gte?: Date; $lte?: Date };
    } = {};

    if (action) matchQuery.action = new RegExp(action, 'i');
    if (userId) matchQuery.userId = new Types.ObjectId(userId);

    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.auditLogModel
        .find(matchQuery)
        .populate('userId', 'fullName email role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.auditLogModel.countDocuments(matchQuery),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAuditLogDetails(logId: string) {
    const log = await this.auditLogModel
      .findById(logId)
      .populate('userId', 'fullName email role');

    if (!log) {
      throw new NotFoundException({
        code: 'AUDIT_LOG_NOT_FOUND',
        userMessage: 'سجل المراجعة غير موجود',
      });
    }

    return { log };
  }

  async getFlaggedAuditLogs() {
    const logs = await this.auditLogModel
      .find({ flagged: true })
      .populate('userId', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(100);

    return { data: logs, total: logs.length };
  }

  async getAuditLogsByResource(resource: string, resourceId: string) {
    const logs = await this.auditLogModel
      .find({
        resource,
        resourceId: new Types.ObjectId(resourceId),
      })
      .populate('userId', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(50);

    return { data: logs, total: logs.length };
  }

  async createAuditLog(data: Partial<AuditLog>): Promise<AuditLog> {
    const log = new this.auditLogModel(data);
    return await log.save();
  }
}
