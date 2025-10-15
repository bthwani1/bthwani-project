import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UtilityService } from './services/utility.service';
import { UtilityOrderService } from './services/utility-order.service';
import {
  CreateUtilityPricingDto,
  UpdateUtilityPricingDto,
  CalculateUtilityPriceDto,
} from './dto/create-utility-pricing.dto';
import { CreateDailyPriceDto } from './dto/daily-price.dto';
import { CreateUtilityOrderDto } from './dto/create-utility-order.dto';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('Utility')
@Controller('utility')
export class UtilityController {
  constructor(
    private readonly utilityService: UtilityService,
    private readonly utilityOrderService: UtilityOrderService,
  ) {}

  // ==================== Public Endpoints ====================

  @Get('options')
  @ApiOperation({ summary: 'الحصول على خيارات الغاز والماء (public)' })
  async getUtilityOptions(@Query('city') city?: string) {
    return this.utilityService.getOptions(city);
  }

  @Post('calculate-price')
  @ApiOperation({ summary: 'حساب سعر خدمة الغاز أو الماء' })
  async calculatePrice(@Body() dto: CalculateUtilityPriceDto) {
    return this.utilityService.calculatePrice(dto);
  }

  // ==================== Admin Endpoints ====================

  @Post('pricing')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء تسعير لمدينة' })
  async createPricing(@Body() dto: CreateUtilityPricingDto) {
    return this.utilityService.create(dto);
  }

  @Get('pricing')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على كل التسعيرات' })
  async getAllPricing() {
    return this.utilityService.findAll();
  }

  @Get('pricing/:city')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على تسعير مدينة' })
  async getPricingByCity(@Param('city') city: string) {
    return this.utilityService.findByCity(city);
  }

  @Patch('pricing/:city')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث تسعير مدينة' })
  async updatePricing(
    @Param('city') city: string,
    @Body() dto: UpdateUtilityPricingDto,
  ) {
    return this.utilityService.update(city, dto);
  }

  @Delete('pricing/:city')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف تسعير مدينة' })
  async deletePricing(@Param('city') city: string) {
    await this.utilityService.delete(city);
    return { message: 'تم حذف التسعير بنجاح' };
  }

  // ==================== Admin Dashboard Compatibility Endpoints ====================

  @Patch('options/gas')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث/إنشاء إعدادات الغاز' })
  async upsertGas(@Body() dto: any) {
    // نفس منطق create أو update
    const existing = await this.utilityService.findByCity(dto.city).catch(() => null);
    if (existing) {
      return this.utilityService.update(dto.city, { gas: dto });
    } else {
      return this.utilityService.create({
        city: dto.city,
        gas: dto,
        isActive: true,
      });
    }
  }

  @Patch('options/water')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث/إنشاء إعدادات الماء' })
  async upsertWater(@Body() dto: any) {
    const existing = await this.utilityService.findByCity(dto.city).catch(() => null);
    if (existing) {
      return this.utilityService.update(dto.city, { water: dto });
    } else {
      return this.utilityService.create({
        city: dto.city,
        water: dto,
        isActive: true,
      });
    }
  }

  // ==================== Daily Pricing Endpoints ====================

  @Get('daily')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على قائمة الأسعار اليومية' })
  async listDaily(
    @Query('kind') kind: 'gas' | 'water',
    @Query('city') city: string,
  ) {
    return this.utilityService.listDailyPrices(kind, city);
  }

  @Post('daily')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة/تحديث سعر يومي' })
  async upsertDaily(@Body() dto: CreateDailyPriceDto) {
    return this.utilityService.upsertDailyPrice(dto);
  }

  @Delete('daily/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف سعر يومي حسب ID' })
  async deleteDaily(@Param('id') id: string) {
    await this.utilityService.deleteDailyPrice(id);
    return { message: 'تم حذف السعر اليومي بنجاح' };
  }

  @Delete('daily')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف سعر يومي حسب المفتاح المركب' })
  async deleteDailyByKey(
    @Query('kind') kind: 'gas' | 'water',
    @Query('city') city: string,
    @Query('date') date: string,
    @Query('variant') variant?: string,
  ) {
    await this.utilityService.deleteDailyPriceByKey(kind, city, date, variant);
    return { message: 'تم حذف السعر اليومي بنجاح' };
  }

  // ==================== Utility Orders Endpoints ====================

  @Post('order')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إنشاء طلب غاز أو ماء' })
  async createOrder(
    @Body() dto: CreateUtilityOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.utilityOrderService.create(dto, userId);
  }

  @Get('orders')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'جلب طلبات المستخدم' })
  async getUserOrders(@CurrentUser('id') userId: string) {
    return this.utilityOrderService.findUserOrders(userId);
  }

  @Get('order/:id')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'جلب تفاصيل طلب' })
  async getOrder(@Param('id') orderId: string) {
    return this.utilityOrderService.findOne(orderId);
  }

  @Patch('order/:id/status')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin', 'driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث حالة الطلب' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: string },
    @CurrentUser('role') role: string,
  ) {
    return this.utilityOrderService.updateStatus(orderId, body.status, role);
  }

  @Patch('order/:id/cancel')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إلغاء الطلب' })
  async cancelOrder(
    @Param('id') orderId: string,
    @Body() body: { reason: string },
  ) {
    return this.utilityOrderService.cancel(orderId, body.reason, 'customer');
  }

  @Post('order/:id/rate')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تقييم الطلب' })
  async rateOrder(
    @Param('id') orderId: string,
    @Body() body: { rating: number; review?: string },
  ) {
    return this.utilityOrderService.rate(orderId, body.rating, body.review);
  }

  @Post('order/:id/assign-driver')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تعيين سائق للطلب' })
  async assignDriver(
    @Param('id') orderId: string,
    @Body() body: { driverId: string },
  ) {
    return this.utilityOrderService.assignDriver(orderId, body.driverId);
  }

  @Get('admin/orders')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'جلب جميع الطلبات (admin)' })
  async getAllOrders(@Query() filters: any) {
    return this.utilityOrderService.findAll(filters);
  }
}
