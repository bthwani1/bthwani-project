import { Injectable } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly wallet: WalletService) {}

  async createHold(dto: { userId: string; amount: number; reference: string }) {
    return this.wallet.holdFunds(dto.userId, dto.amount, dto.reference);
  }

  async release(holdId: string) {
    return this.wallet.releaseFunds(holdId);
  }

  async refund(holdId: string, reason: string) {
    return this.wallet.refundHeldFunds(holdId, reason);
  }
}
