import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { IdempotencyRecord, IdempotencyRecordSchema } from './entities/idempotency.entity';
import { SettlementRecord, SettlementRecordSchema } from './entities/settlement.entity';
import { PerformanceMetric, PerformanceMetricSchema, PerformanceBudget, PerformanceBudgetSchema } from './entities/performance.entity';
import { IdempotencyService } from './services/idempotency.service';
import { DailySettlementService } from './services/daily-settlement.service';
import { PerformanceService } from './services/performance.service';
import { DatabaseIndexService } from './services/database-index.service';
import { CacheService } from './services/cache.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: IdempotencyRecord.name, schema: IdempotencyRecordSchema },
      { name: SettlementRecord.name, schema: SettlementRecordSchema },
      { name: PerformanceMetric.name, schema: PerformanceMetricSchema },
      { name: PerformanceBudget.name, schema: PerformanceBudgetSchema },
    ]),
  ],
  providers: [IdempotencyService, DailySettlementService, PerformanceService, DatabaseIndexService, CacheService],
  exports: [IdempotencyService, DailySettlementService, PerformanceService, DatabaseIndexService, CacheService],
})
export class CommonModule {}
