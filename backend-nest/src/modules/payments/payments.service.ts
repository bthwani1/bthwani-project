import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import Payments, { PaymentType, PaymentStatus, PaymentMethod } from './entities/payments.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payments.name) private readonly model: Model<Payments>,
    private readonly wallet: WalletService
  ) {}

  async createHold(dto: { userId: string; amount: number; reference: string }) {
    return this.wallet.holdFunds(dto.userId, dto.amount, dto.reference);
  }

  async release(holdId: string) {
    return this.wallet.releaseFunds(holdId);
  }

  async refund(holdId: string, reason: string) {
    return this.wallet.refundHeldFunds(holdId, reason);
  }

  async getHold(holdId: string) {
    return this.wallet.getHoldById(holdId);
  }

  async getHoldsByUser(userId: string) {
    return this.wallet.getHoldsByUser(userId);
  }

  async list(filters: any = {}, cursor?: string, limit: number = 25) {
    const query = this.model.find().populate('ownerId', 'name email phone').sort({ _id: -1 });

    // Apply filters
    if (filters.status) query.where('status').equals(filters.status);
    if (filters.type) query.where('type').equals(filters.type);
    if (filters.method) query.where('method').equals(filters.method);
    if (filters.ownerId) query.where('ownerId').equals(filters.ownerId);
    if (filters.amountMin) query.where('amount').gte(filters.amountMin);
    if (filters.amountMax) query.where('amount').lte(filters.amountMax);
    if (filters.reference) query.where('reference').equals(filters.reference);
    if (filters.createdAfter) query.where('createdAt').gte(new Date(filters.createdAfter));
    if (filters.createdBefore) query.where('createdAt').lte(new Date(filters.createdBefore));
    if (filters.search) {
      query.or([
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ]);
    }

    if (cursor) {
      query.where('_id').lt(cursor);
    }

    query.limit(limit + 1); // +1 to check if there are more items

    const items = await query.exec();
    const hasNextPage = items.length > limit;
    const resultItems = hasNextPage ? items.slice(0, -1) : items;
    const nextCursor = hasNextPage ? String(resultItems[resultItems.length - 1]._id) : null;

    return { items: resultItems, nextCursor };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).populate('ownerId', 'name email phone').exec();
    if (!doc) throw new NotFoundException('Payment not found');
    return doc;
  }

  async update(id: string, dto: any) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!doc) throw new NotFoundException('Payment not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Payment not found');
    return { ok: true };
  }

  async getStats() {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const typeStats = await this.model.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      totalAmount: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      refunded: 0,
      deposits: 0,
      withdrawals: 0,
      transfers: 0,
      payments: 0,
      refunds: 0,
      commissions: 0
    };

    stats.forEach(stat => {
      result.total += stat.count;
      result.totalAmount += stat.totalAmount || 0;
      result[stat._id] = stat.count;
    });

    typeStats.forEach(stat => {
      const typeKey = stat._id + 's'; // deposits, withdrawals, etc.
      result[typeKey] = stat.count;
    });

    return result;
  }
}
