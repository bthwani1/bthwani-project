import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommissionService } from './services/commission.service';
import { PayoutService } from './services/payout.service';
import { SettlementService } from './services/settlement.service';
import { CouponService } from './services/coupon.service';
import { ReconciliationService } from './services/reconciliation.service';
import { ReportsService } from './services/reports.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import {
  CreatePayoutBatchDto,
  ApprovePayoutBatchDto,
} from './dto/create-payout-batch.dto';
import {
  CreateSettlementDto,
  ApproveSettlementDto,
} from './dto/create-settlement.dto';
import {
  CreateFinancialCouponDto,
  UpdateFinancialCouponDto,
  ValidateCouponDto,
} from './dto/create-coupon.dto';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

// Roles decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('Finance')
@Controller('finance')
@ApiBearerAuth()
export class FinanceController {
  constructor(
    private readonly commissionService: CommissionService,
    private readonly payoutService: PayoutService,
    private readonly settlementService: SettlementService,
    private readonly couponService: CouponService,
    private readonly reconciliationService: ReconciliationService,
    private readonly reportsService: ReportsService,
  ) {}

  // ==================== Commission Endpoints ====================

  @Post('commissions')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء عمولة جديدة' })
  async createCommission(@Body() dto: CreateCommissionDto) {
    return this.commissionService.create(dto);
  }

  @Get('commissions/my')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'الحصول على عمولاتي' })
  async getMyCommissions(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
  ) {
    return this.commissionService.getByBeneficiary(userId, status);
  }

  @Get('commissions/stats/my')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إحصائيات عمولاتي' })
  async getMyCommissionStats(@CurrentUser('id') userId: string) {
    return this.commissionService.getStatistics(userId);
  }

  @Patch('commissions/:id/approve')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الموافقة على عمولة' })
  async approveCommission(@Param('id') id: string) {
    return this.commissionService.approve(id);
  }

  @Patch('commissions/:id/cancel')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إلغاء عمولة' })
  async cancelCommission(@Param('id') id: string) {
    return this.commissionService.cancel(id);
  }

  // ==================== Payout Endpoints ====================

  @Post('payouts/batches')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء دفعة من العمولات' })
  async createPayoutBatch(
    @Body() dto: { commissionIds: string[]; batch: CreatePayoutBatchDto },
    @CurrentUser('id') userId: string,
  ) {
    return this.payoutService.createBatchFromCommissions(
      dto.commissionIds,
      dto.batch,
      userId,
    );
  }

  @Get('payouts/batches')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على كل الدفعات' })
  async getPayoutBatches(
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
  ): Promise<any> {
    return this.payoutService.findAll(status, limit, cursor);
  }

  @Get('payouts/batches/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على دفعة' })
  async getPayoutBatch(@Param('id') id: string) {
    return this.payoutService.findById(id);
  }

  @Get('payouts/batches/:id/items')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على عناصر دفعة' })
  async getPayoutBatchItems(@Param('id') id: string) {
    return this.payoutService.getBatchItems(id);
  }

  @Patch('payouts/batches/:id/approve')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الموافقة على دفعة' })
  async approvePayoutBatch(
    @Param('id') id: string,
    @Body() dto: ApprovePayoutBatchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.payoutService.approve(id, dto, userId);
  }

  @Patch('payouts/batches/:id/complete')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إكمال دفعة' })
  async completePayoutBatch(
    @Param('id') id: string,
    @Body() dto: { transactionIds: Record<string, string> },
  ) {
    return this.payoutService.complete(id, dto.transactionIds);
  }

  // ==================== Settlement Endpoints ====================

  @Post('settlements')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء تسوية' })
  async createSettlement(@Body() dto: CreateSettlementDto) {
    return this.settlementService.create(dto);
  }

  @Get('settlements/entity/:entityId')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin', 'vendor', 'driver')
  @ApiOperation({ summary: 'الحصول على تسويات كيان' })
  async getEntitySettlements(
    @Param('entityId') entityId: string,
    @Query('entityModel') entityModel: string,
    @Query('status') status?: string,
  ) {
    return this.settlementService.findByEntity(entityId, entityModel, status);
  }

  @Get('settlements/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin', 'vendor', 'driver')
  @ApiOperation({ summary: 'الحصول على تسوية' })
  async getSettlement(@Param('id') id: string) {
    return this.settlementService.findById(id);
  }

  @Patch('settlements/:id/approve')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الموافقة على تسوية' })
  async approveSettlement(
    @Param('id') id: string,
    @Body() dto: ApproveSettlementDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.settlementService.approve(id, dto, userId);
  }

  // ==================== Coupon Endpoints ====================

  @Post('coupons')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء كوبون' })
  async createCoupon(
    @Body() dto: CreateFinancialCouponDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.couponService.create(dto, userId);
  }

  @Post('coupons/validate')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'التحقق من كوبون' })
  async validateCoupon(
    @Body() dto: ValidateCouponDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.couponService.validate(dto, userId);
  }

  @Get('coupons')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على كل الكوبونات' })
  async getCoupons(@Query('isActive') isActive?: boolean) {
    return this.couponService.findAll(isActive);
  }

  @Patch('coupons/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'تحديث كوبون' })
  async updateCoupon(
    @Param('id') id: string,
    @Body() dto: UpdateFinancialCouponDto,
  ) {
    return this.couponService.update(id, dto);
  }

  // ==================== Reconciliation Endpoints ====================

  @Post('reconciliations')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء مطابقة مالية' })
  async createReconciliation(
    @Body() dto: { startDate: string; endDate: string; periodType: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.reconciliationService.create(
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.periodType,
      userId,
    );
  }

  @Get('reconciliations')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على كل المطابقات' })
  async getReconciliations(@Query('status') status?: string) {
    return this.reconciliationService.findAll(status);
  }

  @Get('reconciliations/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على مطابقة' })
  async getReconciliation(@Param('id') id: string) {
    return this.reconciliationService.findById(id);
  }

  @Patch('reconciliations/:id/actual-totals')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إضافة الإجماليات الفعلية' })
  async addActualTotals(
    @Param('id') id: string,
    @Body()
    dto: {
      totalDeposits: number;
      totalWithdrawals: number;
      totalFees: number;
    },
  ) {
    return this.reconciliationService.addActualTotals(id, dto);
  }

  @Post('reconciliations/:id/issues')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إضافة مشكلة للمطابقة' })
  async addReconciliationIssue(
    @Param('id') id: string,
    @Body()
    dto: {
      type: 'missing_transaction' | 'amount_mismatch' | 'duplicate' | 'other';
      description: string;
      expectedAmount?: number;
      actualAmount?: number;
      transactionRef?: string;
    },
  ) {
    return this.reconciliationService.addIssue(id, dto);
  }

  @Patch('reconciliations/:id/issues/:issueIndex/resolve')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'حل مشكلة في المطابقة' })
  async resolveReconciliationIssue(
    @Param('id') id: string,
    @Param('issueIndex') issueIndex: number,
    @Body() dto: { resolution: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.reconciliationService.resolveIssue(
      id,
      Number(issueIndex),
      dto.resolution,
      userId,
    );
  }

  // ==================== Reports Endpoints ====================

  @Post('reports/daily')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء تقرير يومي' })
  async generateDailyReport(@Body() dto: { date: string }) {
    return this.reportsService.generateDailyReport(new Date(dto.date));
  }

  @Get('reports/daily/:date')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على تقرير يومي' })
  async getDailyReport(@Param('date') date: string) {
    return this.reportsService.getDailyReport(new Date(date));
  }

  @Get('reports')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على التقارير' })
  async getReports(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getReports(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Patch('reports/:id/finalize')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'تثبيت تقرير' })
  async finalizeReport(@Param('id') id: string) {
    return this.reportsService.finalizeReport(id);
  }
}
