import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
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
import { User, UserSchema } from '../auth/entities/user.entity';
import { Order, OrderSchema } from '../order/entities/order.entity';
import { Driver, DriverSchema } from '../driver/entities/driver.entity';
import { Vendor, VendorSchema } from '../vendor/entities/vendor.entity';
import { Store, StoreSchema } from '../store/entities/store.entity';
import {
  WithdrawalRequest,
  WithdrawalRequestSchema,
} from '../finance/entities/withdrawal-request.entity';
import {
  SupportTicket,
  SupportTicketSchema,
} from '../support/entities/support-ticket.entity';
import { AuditLog, AuditLogSchema } from './entities/audit-log.entity';
import {
  DataDeletionRequest,
  DataDeletionRequestSchema,
} from '../legal/entities/data-deletion-request.entity';
import { AppSettings, AppSettingsSchema } from './entities/app-settings.entity';
import {
  FeatureFlag,
  FeatureFlagSchema,
} from './entities/feature-flag.entity';
import {
  LoginAttempt,
  LoginAttemptSchema,
} from './entities/login-attempt.entity';
import {
  BackupRecord,
  BackupRecordSchema,
} from './entities/backup-record.entity';
import {
  DriverShift,
  DriverShiftSchema,
} from '../driver/entities/driver-shift.entity';
import { Attendance, AttendanceSchema } from '../er/entities/attendance.entity';
import {
  LeaveRequest,
  LeaveRequestSchema,
} from '../er/entities/leave-request.entity';
import { Marketer, MarketerSchema } from '../marketer/entities/marketer.entity';
import {
  CommissionPlan,
  CommissionPlanSchema,
} from '../marketer/entities/commission-plan.entity';
import {
  Onboarding,
  OnboardingSchema,
} from '../marketer/entities/onboarding.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Store.name, schema: StoreSchema },
      { name: WithdrawalRequest.name, schema: WithdrawalRequestSchema },
      { name: SupportTicket.name, schema: SupportTicketSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: DataDeletionRequest.name, schema: DataDeletionRequestSchema },
      { name: AppSettings.name, schema: AppSettingsSchema },
      { name: FeatureFlag.name, schema: FeatureFlagSchema },
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
      { name: BackupRecord.name, schema: BackupRecordSchema },
      { name: DriverShift.name, schema: DriverShiftSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: LeaveRequest.name, schema: LeaveRequestSchema },
      { name: Marketer.name, schema: MarketerSchema },
      { name: CommissionPlan.name, schema: CommissionPlanSchema },
      { name: Onboarding.name, schema: OnboardingSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
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
  ],
  exports: [
    AdminService,
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
  ],
})
export class AdminModule {}
