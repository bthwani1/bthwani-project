import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payments, PaymentsSchema } from './entities/payments.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WalletModule } from '../wallet/wallet.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payments.name, schema: PaymentsSchema }]),
    WalletModule, FinanceModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {} 
