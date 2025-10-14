import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, Roles } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ==================== ROAS ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('roas/daily')
  @ApiOperation({ summary: 'ROAS اليومي' })
  async getDailyRoas(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('platform') platform?: string,
  ) {
    return this.analyticsService.getDailyRoas(startDate, endDate, platform);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('roas/summary')
  @ApiOperation({ summary: 'ملخص ROAS' })
  async getRoasSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getRoasSummary(startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('roas/by-platform')
  @ApiOperation({ summary: 'ROAS حسب المنصة' })
  async getRoasByPlatform(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getRoasByPlatform(startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Post('roas/calculate')
  @ApiOperation({ summary: 'حساب ROAS' })
  async calculateRoas(@Body() body: { date: string }) {
    return this.analyticsService.calculateRoas(body.date);
  }

  // ==================== Ad Spend ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Post('adspend')
  @ApiOperation({ summary: 'تسجيل إنفاق إعلاني' })
  async recordAdSpend(
    @Body()
    body: {
      date: string;
      platform: string;
      campaignName: string;
      amount: number;
      impressions?: number;
      clicks?: number;
      conversions?: number;
    },
  ) {
    return this.analyticsService.recordAdSpend(body);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('adspend')
  @ApiOperation({ summary: 'الإنفاق الإعلاني' })
  async getAdSpend(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('platform') platform?: string,
  ) {
    return this.analyticsService.getAdSpend(startDate, endDate, platform);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('adspend/summary')
  @ApiOperation({ summary: 'ملخص الإنفاق الإعلاني' })
  async getAdSpendSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getAdSpendSummary(startDate, endDate);
  }

  // ==================== KPIs ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('kpis')
  @ApiOperation({ summary: 'مؤشرات الأداء الرئيسية' })
  async getKPIs(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getKPIs(startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('kpis/real-time')
  @ApiOperation({ summary: 'مؤشرات الأداء الحية' })
  async getRealTimeKPIs() {
    return this.analyticsService.getRealTimeKPIs();
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('kpis/trends')
  @ApiOperation({ summary: 'اتجاهات الأداء' })
  async getKPITrends(
    @Query('metric') metric: string,
    @Query('period') period: 'daily' | 'weekly' | 'monthly',
  ) {
    return this.analyticsService.getKPITrends(metric, period);
  }

  // ==================== Marketing Events ====================

  @Post('events/track')
  @ApiOperation({ summary: 'تتبع حدث تسويقي' })
  async trackEvent(
    @Body()
    body: {
      eventType: string;
      userId?: string;
      source?: string;
      medium?: string;
      campaign?: string;
      metadata?: any;
    },
  ) {
    return this.analyticsService.trackEvent(body);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('events')
  @ApiOperation({ summary: 'الأحداث التسويقية' })
  async getEvents(
    @Query('eventType') eventType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getEvents(eventType, startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('events/summary')
  @ApiOperation({ summary: 'ملخص الأحداث' })
  async getEventsSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getEventsSummary(startDate, endDate);
  }

  // ==================== Conversion Funnel ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('funnel/conversion')
  @ApiOperation({ summary: 'قمع التحويل' })
  async getConversionFunnel(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getConversionFunnel(startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('funnel/drop-off')
  @ApiOperation({ summary: 'نقاط الانسحاب' })
  async getDropOffPoints() {
    return this.analyticsService.getDropOffPoints();
  }

  // ==================== User Analytics ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('users/growth')
  @ApiOperation({ summary: 'نمو المستخدمين' })
  async getUserGrowth(@Query('period') period: 'daily' | 'weekly' | 'monthly') {
    return this.analyticsService.getUserGrowth(period);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('users/retention')
  @ApiOperation({ summary: 'معدل الاحتفاظ' })
  async getUserRetention() {
    return this.analyticsService.getUserRetention();
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('users/cohort')
  @ApiOperation({ summary: 'تحليل الأفواج' })
  async getCohortAnalysis(@Query('cohortDate') cohortDate: string) {
    return this.analyticsService.getCohortAnalysis(cohortDate);
  }

  // ==================== Revenue Analytics ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('revenue/forecast')
  @ApiOperation({ summary: 'توقعات الإيرادات' })
  async getRevenueForecast() {
    return this.analyticsService.getRevenueForecast();
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('revenue/breakdown')
  @ApiOperation({ summary: 'تفصيل الإيرادات' })
  async getRevenueBreakdown(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getRevenueBreakdown(startDate, endDate);
  }

  // ==================== Advanced Analytics ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/dashboard-overview')
  @ApiOperation({ summary: 'نظرة عامة متقدمة' })
  async getDashboardOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getDashboardOverview(startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/cohort-analysis-advanced')
  @ApiOperation({ summary: 'تحليل المجموعات المتقدم' })
  async getCohortAnalysisAdvanced(@Query('type') type: string = 'monthly') {
    return this.analyticsService.getCohortAnalysisAdvanced(type);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/funnel-analysis')
  @ApiOperation({ summary: 'تحليل القمع' })
  async getFunnelAnalysis(@Query('funnelType') funnelType: string) {
    return this.analyticsService.getFunnelAnalysis(funnelType);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/retention')
  @ApiOperation({ summary: 'معدل الاحتفاظ' })
  async getRetentionRate(@Query('period') period: string = 'monthly') {
    return this.analyticsService.getRetentionRate(period);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/ltv')
  @ApiOperation({ summary: 'القيمة الدائمة للعميل' })
  async getCustomerLTV() {
    return this.analyticsService.getCustomerLTV();
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/churn-rate')
  @ApiOperation({ summary: 'معدل التراجع' })
  async getChurnRate(@Query('period') period: string = 'monthly') {
    return this.analyticsService.getChurnRate(period);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/geographic-distribution')
  @ApiOperation({ summary: 'التوزيع الجغرافي' })
  async getGeographicDistribution(@Query('metric') metric: string = 'orders') {
    return this.analyticsService.getGeographicDistribution(metric);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/peak-hours')
  @ApiOperation({ summary: 'ساعات الذروة' })
  async getPeakHours() {
    return this.analyticsService.getPeakHours();
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/product-performance')
  @ApiOperation({ summary: 'أداء المنتجات' })
  async getProductPerformance(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getProductPerformance(startDate, endDate);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @Get('advanced/driver-performance')
  @ApiOperation({ summary: 'أداء السائقين' })
  async getDriverPerformance(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getDriverPerformance(startDate, endDate);
  }
}
