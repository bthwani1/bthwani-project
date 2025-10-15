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
import { PromotionService } from './services/promotion.service';
import {
  CreatePromotionDto,
  UpdatePromotionDto,
  GetPromotionsByPlacementDto,
} from './dto/create-promotion.dto';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('Promotion')
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  // ==================== Public Endpoints ====================

  @Get('by-placement')
  @ApiOperation({ summary: 'الحصول على عروض حسب الموضع (public)' })
  async getPromotionsByPlacement(@Query() dto: GetPromotionsByPlacementDto) {
    return this.promotionService.getByPlacement(dto);
  }

  @Post(':id/click')
  @ApiOperation({ summary: 'تسجيل نقرة على عرض' })
  async recordClick(@Param('id') id: string) {
    await this.promotionService.recordClick(id);
    return { message: 'تم تسجيل النقرة' };
  }

  @Post(':id/conversion')
  @ApiOperation({ summary: 'تسجيل تحويل (طلب من العرض)' })
  async recordConversion(@Param('id') id: string) {
    await this.promotionService.recordConversion(id);
    return { message: 'تم تسجيل التحويل' };
  }

  // ==================== Admin Endpoints ====================

  @Post()
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء عرض ترويجي' })
  async createPromotion(
    @Body() dto: CreatePromotionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.promotionService.create(dto, userId);
  }

  @Get()
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على كل العروض' })
  async getAllPromotions(@Query('isActive') isActive?: boolean) {
    return this.promotionService.findAll(isActive);
  }

  @Get(':id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على عرض محدد' })
  async getPromotion(@Param('id') id: string) {
    return this.promotionService.findById(id);
  }

  @Patch(':id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث عرض' })
  async updatePromotion(
    @Param('id') id: string,
    @Body() dto: UpdatePromotionDto,
  ) {
    return this.promotionService.update(id, dto);
  }

  @Delete(':id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف عرض' })
  async deletePromotion(@Param('id') id: string) {
    await this.promotionService.delete(id);
    return { message: 'تم حذف العرض بنجاح' };
  }

  @Get('stats/overview')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إحصائيات العروض' })
  async getStatistics() {
    return this.promotionService.getStatistics();
  }
}
