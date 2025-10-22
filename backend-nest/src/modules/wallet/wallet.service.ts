import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Connection, ClientSession } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { User } from '../auth/entities/user.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import {
  TransactionHelper,
  WalletHelper,
  PaginationHelper,
} from '../../common/utils';
import { WithdrawalService } from '../withdrawal/withdrawal.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: Model<WalletTransaction>,
    @InjectConnection() private readonly connection: Connection,
    private withdrawalService: WithdrawalService,
  ) {}

  // جلب رصيد المحفظة
  async getWalletBalance(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        userMessage: 'المستخدم غير موجود',
        suggestedAction: 'يرجى التحقق من المعرف',
      });
    }

    return {
      userId: user._id,
      balance: user.wallet.balance,
      onHold: user.wallet.onHold,
      availableBalance: user.wallet.balance - user.wallet.onHold,
      totalSpent: user.wallet.totalSpent,
      totalEarned: user.wallet.totalEarned,
      loyaltyPoints: user.wallet.loyaltyPoints,
      savings: user.wallet.savings,
      currency: user.wallet.currency,
      lastUpdated: user.wallet.lastUpdated,
    };
  }

  // إنشاء معاملة جديدة (مع Transaction)
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    return TransactionHelper.executeInTransaction(
      this.connection,
      async (session) => {
        const user = await this.userModel
          .findById(createTransactionDto.userId)
          .session(session);

        if (!user) {
          throw new NotFoundException({
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            userMessage: 'المستخدم غير موجود',
          });
        }

        // التحقق من الرصيد في حالة الخصم
        if (createTransactionDto.type === 'debit') {
          WalletHelper.validateBalance(
            user.wallet.balance,
            user.wallet.onHold,
            createTransactionDto.amount,
          );
        }

        // إنشاء المعاملة
        const [transaction] = await this.walletTransactionModel.create(
          [
            {
              ...createTransactionDto,
              userId: new Types.ObjectId(createTransactionDto.userId),
            },
          ],
          { session },
        );

        // تحديث رصيد المحفظة
        await this.updateUserWalletBalance(
          createTransactionDto.userId,
          createTransactionDto.amount,
          createTransactionDto.type as 'credit' | 'debit',
          session,
        );

        return transaction;
      },
    );
  }

  // تحديث رصيد المحفظة
  private async updateUserWalletBalance(
    userId: string,
    amount: number,
    type: 'credit' | 'debit',
    session?: ClientSession,
  ) {
    const updateQuery = WalletHelper.createWalletUpdate(amount, type);

    await this.userModel.findByIdAndUpdate(userId, updateQuery, {
      new: true,
      session,
    });
  }

  // جلب سجل المعاملات مع Cursor Pagination
  async getTransactions(userId: string, pagination: CursorPaginationDto) {
    return PaginationHelper.paginate(
      this.walletTransactionModel,
      { userId: new Types.ObjectId(userId) },
      pagination,
    );
  }

  // حجز مبلغ (Escrow) - مع Transaction
  async holdFunds(userId: string, amount: number, orderId?: string) {
    return TransactionHelper.executeInTransaction(
      this.connection,
      async (session) => {
        const user = await this.userModel.findById(userId).session(session);

        if (!user) {
          throw new NotFoundException({
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            userMessage: 'المستخدم غير موجود',
          });
        }

        // التحقق من الرصيد
        WalletHelper.validateBalance(
          user.wallet.balance,
          user.wallet.onHold,
          amount,
        );

        // تحديث المبلغ المحجوز
        const holdUpdate = WalletHelper.createHoldUpdate(amount);
        await this.userModel.findByIdAndUpdate(userId, holdUpdate, {
          new: true,
          session,
        });

        // إنشاء معاملة حجز
        const [transaction] = await this.walletTransactionModel.create(
          [
            {
              userId: new Types.ObjectId(userId),
              userModel: 'User',
              amount,
              type: 'debit',
              method: 'escrow',
              status: 'pending',
              description: 'حجز مبلغ للطلب',
              meta: orderId ? { orderId } : {},
            },
          ],
          { session },
        );

        return transaction;
      },
    );
  }

  // إطلاق المبلغ المحجوز - مع Transaction
  async releaseFunds(userId: string, amount: number, orderId?: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(userId).session(session);

      if (!user) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          userMessage: 'المستخدم غير موجود',
        });
      }

      // تحديث المبلغ المحجوز والرصيد
      await this.userModel.findByIdAndUpdate(
        userId,
        {
          $inc: {
            'wallet.onHold': -amount,
            'wallet.balance': -amount,
            'wallet.totalSpent': amount,
          },
          'wallet.lastUpdated': new Date(),
        },
        { new: true, session },
      );

      // تحديث حالة المعاملة
      await this.walletTransactionModel.findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          method: 'escrow',
          status: 'pending',
          'meta.orderId': orderId,
        },
        { status: 'completed' },
        { session },
      );

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }

  // إرجاع المبلغ المحجوز - مع Transaction
  async refundHeldFunds(userId: string, amount: number, orderId?: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(userId).session(session);

      if (!user) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          userMessage: 'المستخدم غير موجود',
        });
      }

      // إلغاء الحجز فقط
      await this.userModel.findByIdAndUpdate(
        userId,
        {
          $inc: { 'wallet.onHold': -amount },
          'wallet.lastUpdated': new Date(),
        },
        { new: true, session },
      );

      // تحديث حالة المعاملة
      await this.walletTransactionModel.findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          method: 'escrow',
          status: 'pending',
          'meta.orderId': orderId,
        },
        { status: 'reversed' },
        { session },
      );

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }

  // ==================== Topup (Kuraimi) ====================

  async topupViaKuraimi(
    userId: string,
    amount: number,
    SCustID: string,
    _PINPASS: string,
  ) {
    void _PINPASS; // TODO: Integrate with Kuraimi API
    // const paymentResult = await sendPaymentToKuraimi({ amount, SCustID, PINPASS });

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(userId).session(session);
      if (!user) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          userMessage: 'المستخدم غير موجود',
        });
      }

      // Simulate success for now
      await this.userModel.findByIdAndUpdate(
        userId,
        {
          $inc: {
            'wallet.balance': amount,
            'wallet.totalEarned': amount,
          },
          'wallet.lastUpdated': new Date(),
        },
        { new: true, session },
      );

      // Create transaction
      const [transaction] = await this.walletTransactionModel.create(
        [
          {
            userId: new Types.ObjectId(userId),
            userModel: 'User',
            amount,
            type: 'credit',
            method: 'kuraimi',
            status: 'completed',
            description: 'شحن المحفظة عبر كريمي',
            meta: { SCustID },
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return {
        success: true,
        transaction,
        newBalance: user.wallet.balance + amount,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }

  async verifyTopup(userId: string, transactionId: string) {
    const transaction =
      await this.walletTransactionModel.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException({
        code: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found',
        userMessage: 'المعاملة غير موجودة',
      });
    }

    return { verified: transaction.status === 'completed', transaction };
  }

  async getTopupHistory(userId: string, pagination: CursorPaginationDto) {
    return PaginationHelper.paginate(
      this.walletTransactionModel,
      {
        userId: new Types.ObjectId(userId),
        type: 'credit',
        method: { $in: ['kuraimi', 'card', 'bank'] },
      },
      pagination,
    );
  }

  async getTopupMethods() {
    await Promise.resolve();
    return {
      methods: [
        { id: 'kuraimi', name: 'كريمي', enabled: true },
        { id: 'card', name: 'بطاقة بنكية', enabled: false },
        { id: 'bank', name: 'تحويل بنكي', enabled: false },
      ],
    };
  }

  // ==================== Withdrawals ====================

  async requestWithdrawal(
    userId: string,
    amount: number,
    _method: string,
    _accountInfo: Record<string, unknown>,
  ) {
    void _method;
    void _accountInfo;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        userMessage: 'المستخدم غير موجود',
      });
    }

    const availableBalance = user.wallet.balance - user.wallet.onHold;

    if (availableBalance < amount) {
      throw new BadRequestException({
        code: 'INSUFFICIENT_BALANCE',
        message: 'Insufficient balance',
        userMessage: 'الرصيد غير كافٍ',
        details: { available: availableBalance, required: amount },
      });
    }

    // TODO: Create WithdrawalRequest model and record

    return {
      success: true,
      message: 'تم تقديم طلب السحب',
      requestId: 'withdrawal_' + Date.now(),
    };
  }

  async getMyWithdrawals(_userId: string, _pagination: CursorPaginationDto) {
    void _userId;
    void _pagination; // TODO: Implement WithdrawalRequest model
    await Promise.resolve();
    return {
      data: [],
      pagination: { nextCursor: null, hasMore: false, limit: 20 },
    };
  }

  async cancelWithdrawal(_withdrawalId: string, _userId: string) {
    void _withdrawalId;
    void _userId; // TODO: Implement
    await Promise.resolve();
    return { success: true, message: 'تم إلغاء طلب السحب' };
  }

  async getWithdrawMethods() {
    await Promise.resolve();
    return {
      methods: [
        {
          id: 'bank_transfer',
          name: 'تحويل بنكي',
          minAmount: 100,
          maxAmount: 10000,
        },
        { id: 'kuraimi', name: 'كريمي', minAmount: 50, maxAmount: 5000 },
        { id: 'cash', name: 'نقداً', minAmount: 100, maxAmount: 2000 },
      ],
    };
  }

  // ==================== Coupons ====================

  async applyCoupon(_userId: string, _code: string, _amount?: number) {
    void _userId;
    void _code;
    void _amount; // TODO: Implement Coupon model and validation
    await Promise.resolve();
    return { success: true, discount: 0, message: 'الكوبون غير صالح' };
  }

  async validateCoupon(_userId: string, _code: string) {
    void _userId;
    void _code; // TODO: Implement
    await Promise.resolve();
    return { valid: false, discount: 0 };
  }

  async getMyCoupons(_userId: string) {
    void _userId; // TODO: Implement
    await Promise.resolve();
    return { data: [] };
  }

  async getCouponHistory(_userId: string, _pagination: CursorPaginationDto) {
    void _userId;
    void _pagination; // TODO: Implement
    await Promise.resolve();
    return {
      data: [],
      pagination: { nextCursor: null, hasMore: false, limit: 20 },
    };
  }

  // ==================== Subscriptions ====================

  async subscribe(_userId: string, _planId: string, _autoRenew?: boolean) {
    void _userId;
    void _planId;
    void _autoRenew; // TODO: Implement Subscription model
    await Promise.resolve();
    return {
      success: true,
      message: 'تم الاشتراك بنجاح',
      subscriptionId: 'sub_' + Date.now(),
    };
  }

  async getMySubscriptions(_userId: string) {
    void _userId; // TODO: Implement
    await Promise.resolve();
    return { data: [] };
  }

  async cancelSubscription(_subscriptionId: string, _userId: string) {
    void _subscriptionId;
    void _userId; // TODO: Implement
    await Promise.resolve();
    return { success: true, message: 'تم إلغاء الاشتراك' };
  }

  // ==================== Pay Bills ====================

  async payBill(
    userId: string,
    billType: string,
    billNumber: string,
    amount: number,
  ) {
    return TransactionHelper.executeInTransaction(
      this.connection,
      async (session) => {
        const user = await this.userModel.findById(userId).session(session);

        if (!user) {
          throw new NotFoundException({
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            userMessage: 'المستخدم غير موجود',
          });
        }

        // التحقق من الرصيد
        WalletHelper.validateBalance(
          user.wallet.balance,
          user.wallet.onHold,
          amount,
        );

        // خصم المبلغ
        const debitUpdate = WalletHelper.createDebitUpdate(amount);
        await this.userModel.findByIdAndUpdate(userId, debitUpdate, {
          new: true,
          session,
        });

        // إنشاء المعاملة
        const [transaction] = await this.walletTransactionModel.create(
          [
            {
              userId: new Types.ObjectId(userId),
              userModel: 'User',
              amount,
              type: 'debit',
              method: 'bill_payment',
              status: 'completed',
              description: `دفع فاتورة ${billType}`,
              meta: { billType, billNumber },
            },
          ],
          { session },
        );

        return {
          success: true,
          transaction,
          newBalance: user.wallet.balance - amount,
        };
      },
    );
  }

  async getBills(userId: string, pagination: CursorPaginationDto) {
    const query: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
      method: 'bill_payment',
    };

    if (pagination.cursor) {
      query._id = { $gt: new Types.ObjectId(pagination.cursor) };
    }

    const limit = pagination.limit || 20;
    const items = await this.walletTransactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = items.length > limit;
    const results = hasMore ? items.slice(0, -1) : items;

    return {
      data: results,
      pagination: {
        nextCursor: hasMore
          ? (
              results[results.length - 1] as { _id: Types.ObjectId }
            )._id.toString()
          : null,
        hasMore,
        limit,
      },
    };
  }

  // ==================== Transfers ====================

  async transferFunds(
    userId: string,
    recipientPhone: string,
    amount: number,
    notes?: string,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const sender = await this.userModel.findById(userId).session(session);

      if (!sender) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          userMessage: 'المستخدم غير موجود',
        });
      }

      const recipient = await this.userModel
        .findOne({ phone: recipientPhone })
        .session(session);

      if (!recipient) {
        throw new NotFoundException({
          code: 'RECIPIENT_NOT_FOUND',
          message: 'Recipient not found',
          userMessage: 'المستلم غير موجود',
        });
      }

      const availableBalance = sender.wallet.balance - sender.wallet.onHold;

      if (availableBalance < amount) {
        throw new BadRequestException({
          code: 'INSUFFICIENT_BALANCE',
          message: 'Insufficient balance',
          userMessage: 'الرصيد غير كافٍ',
          details: { available: availableBalance, required: amount },
        });
      }

      // Deduct from sender
      await this.userModel.findByIdAndUpdate(
        userId,
        {
          $inc: {
            'wallet.balance': -amount,
            'wallet.totalSpent': amount,
          },
          'wallet.lastUpdated': new Date(),
        },
        { new: true, session },
      );

      // Add to recipient
      await this.userModel.findByIdAndUpdate(
        recipient._id,
        {
          $inc: {
            'wallet.balance': amount,
            'wallet.totalEarned': amount,
          },
          'wallet.lastUpdated': new Date(),
        },
        { new: true, session },
      );

      // Create transactions
      await this.walletTransactionModel.create(
        [
          {
            userId: new Types.ObjectId(userId),
            userModel: 'User',
            amount,
            type: 'debit',
            method: 'transfer',
            status: 'completed',
            description: `تحويل إلى ${recipient.fullName}`,
            meta: { recipientId: recipient._id, notes },
          },
          {
            userId: recipient._id,
            userModel: 'User',
            amount,
            type: 'credit',
            method: 'transfer',
            status: 'completed',
            description: `تحويل من ${sender.fullName}`,
            meta: { senderId: sender._id, notes },
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return { success: true, message: 'تم التحويل بنجاح' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }

  async getTransfers(userId: string, pagination: CursorPaginationDto) {
    const query: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
      method: 'transfer',
    };

    if (pagination.cursor) {
      query._id = { $gt: new Types.ObjectId(pagination.cursor) };
    }

    const limit = pagination.limit || 20;
    const items = await this.walletTransactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = items.length > limit;
    const results = hasMore ? items.slice(0, -1) : items;

    return {
      data: results,
      pagination: {
        nextCursor: hasMore
          ? (
              results[results.length - 1] as { _id: Types.ObjectId }
            )._id.toString()
          : null,
        hasMore,
        limit,
      },
    };
  }

  // ==================== Additional ====================

  async getTransactionDetails(transactionId: string, userId: string) {
    const transaction = await this.walletTransactionModel.findOne({
      _id: transactionId,
      userId: new Types.ObjectId(userId),
    });

    if (!transaction) {
      throw new NotFoundException({
        code: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found',
        userMessage: 'المعاملة غير موجودة',
      });
    }

    return { transaction };
  }

  async requestRefund(
    _userId: string,
    _transactionId: string,
    _reason: string,
  ) {
    void _userId;
    void _transactionId;
    void _reason; // TODO: Implement refund request logic
    await Promise.resolve();
    return { success: true, message: 'تم تقديم طلب الاسترجاع' };
  }

  // ==================== Admin Withdrawal Management ====================

  async getAllWithdrawals(query?: any) {
    return this.withdrawalService.getWithdrawals(query);
  }

  async getPendingWithdrawals() {
    return this.withdrawalService.getPendingWithdrawals();
  }

  async approveWithdrawal(data: any): Promise<any> {
    return this.withdrawalService.approveWithdrawal(data);
  }

  async rejectWithdrawal(data: any): Promise<any> {
    return this.withdrawalService.rejectWithdrawal(data);
  }
}
