import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketerService } from './marketer.service';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, Roles, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Marketer')
@Controller('marketer')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class MarketerController {
  constructor(private readonly marketerService: MarketerService) {}

  // ==================== Marketer Profile ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'ملفي الشخصي' })
  async getProfile(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getProfile(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'تحديث الملف الشخصي' })
  async updateProfile(
    @CurrentUser('id') marketerId: string,
    @Body() body: any,
  ) {
    return this.marketerService.updateProfile(marketerId, body);
  }

  // ==================== Onboarding ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Post('onboarding')
  @ApiOperation({ summary: 'تسجيل متجر/تاجر جديد' })
  async createOnboarding(
    @CurrentUser('id') marketerId: string,
    @Body()
    body: {
      storeName: string;
      ownerName: string;
      phone: string;
      email?: string;
      address: any;
      type: 'store' | 'vendor' | 'driver';
    },
  ) {
    return this.marketerService.createOnboarding(marketerId, body);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('onboarding/my')
  @ApiOperation({ summary: 'طلبات التسجيل الخاصة بي' })
  async getMyOnboardings(
    @CurrentUser('id') marketerId: string,
    @Query('status') status?: string,
  ) {
    return this.marketerService.getMyOnboardings(marketerId, status);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('onboarding/:id')
  @ApiOperation({ summary: 'تفاصيل طلب تسجيل' })
  async getOnboardingDetails(@Param('id') onboardingId: string) {
    return this.marketerService.getOnboardingDetails(onboardingId);
  }

  // ==================== Quick Onboarding ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Post('quick-onboard')
  @ApiOperation({ summary: 'تسجيل سريع' })
  async quickOnboard(
    @CurrentUser('id') marketerId: string,
    @Body() body: { phone: string; storeName: string; location: any },
  ) {
    return this.marketerService.quickOnboard(marketerId, body);
  }

  // ==================== Referrals ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Post('referrals/generate-code')
  @ApiOperation({ summary: 'إنشاء كود إحالة' })
  async generateReferralCode(@CurrentUser('id') marketerId: string) {
    return this.marketerService.generateReferralCode(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('referrals/my')
  @ApiOperation({ summary: 'إحالاتي' })
  async getMyReferrals(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getMyReferrals(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('referrals/statistics')
  @ApiOperation({ summary: 'إحصائيات الإحالات' })
  async getReferralStatistics(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getReferralStatistics(marketerId);
  }

  // ==================== Stores Management ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('stores/my')
  @ApiOperation({ summary: 'متاجري' })
  async getMyStores(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getMyStores(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('stores/:id')
  @ApiOperation({ summary: 'تفاصيل متجر' })
  async getStoreDetails(@Param('id') storeId: string) {
    return this.marketerService.getStoreDetails(storeId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('stores/:id/performance')
  @ApiOperation({ summary: 'أداء المتجر' })
  async getStorePerformance(
    @Param('id') storeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.marketerService.getStorePerformance(
      storeId,
      startDate,
      endDate,
    );
  }

  // ==================== Vendors Management ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('vendors/my')
  @ApiOperation({ summary: 'تجاري' })
  async getMyVendors(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getMyVendors(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('vendors/:id')
  @ApiOperation({ summary: 'تفاصيل تاجر' })
  async getVendorDetails(@Param('id') vendorId: string) {
    return this.marketerService.getVendorDetails(vendorId);
  }

  // ==================== Commissions ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('commissions/my')
  @ApiOperation({ summary: 'عمولاتي' })
  async getMyCommissions(
    @CurrentUser('id') marketerId: string,
    @Query('status') status?: string,
  ) {
    return this.marketerService.getMyCommissions(marketerId, status);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('commissions/statistics')
  @ApiOperation({ summary: 'إحصائيات العمولات' })
  async getCommissionStatistics(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getCommissionStatistics(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('commissions/pending')
  @ApiOperation({ summary: 'العمولات المعلقة' })
  async getPendingCommissions(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getPendingCommissions(marketerId);
  }

  // ==================== Overview & Statistics ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('overview')
  @ApiOperation({ summary: 'نظرة عامة' })
  async getOverview(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getOverview(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('statistics/today')
  @ApiOperation({ summary: 'إحصائيات اليوم' })
  async getTodayStatistics(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getTodayStatistics(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('statistics/month')
  @ApiOperation({ summary: 'إحصائيات الشهر' })
  async getMonthStatistics(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getMonthStatistics(marketerId);
  }

  // ==================== Earnings ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('earnings')
  @ApiOperation({ summary: 'أرباحي' })
  async getEarnings(
    @CurrentUser('id') marketerId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.marketerService.getEarnings(marketerId, startDate, endDate);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('earnings/breakdown')
  @ApiOperation({ summary: 'تفصيل الأرباح' })
  async getEarningsBreakdown(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getEarningsBreakdown(marketerId);
  }

  // ==================== Documents & Files ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Post('files/upload')
  @ApiOperation({ summary: 'رفع ملف' })
  async uploadFile(
    @CurrentUser('id') marketerId: string,
    @Body() body: { fileUrl: string; type: string; relatedTo?: string },
  ) {
    return this.marketerService.uploadFile(marketerId, body);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('files')
  @ApiOperation({ summary: 'ملفاتي' })
  async getFiles(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getFiles(marketerId);
  }

  // ==================== Notifications ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('notifications')
  @ApiOperation({ summary: 'إشعاراتي' })
  async getNotifications(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getNotifications(marketerId);
  }

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Patch('notifications/:id/read')
  @ApiOperation({ summary: 'تحديد إشعار كمقروء' })
  async markNotificationRead(@Param('id') notificationId: string) {
    return this.marketerService.markNotificationRead(notificationId);
  }

  // ==================== Territories ====================

  @Auth(AuthType.MARKETER_JWT)
  @ApiBearerAuth()
  @Get('territory/stats')
  @ApiOperation({ summary: 'إحصائيات المنطقة' })
  async getTerritoryStats(@CurrentUser('id') marketerId: string) {
    return this.marketerService.getTerritoryStats(marketerId);
  }
}

