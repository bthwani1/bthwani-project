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
import {
  CreateUtilityPricingDto,
  UpdateUtilityPricingDto,
  CalculateUtilityPriceDto,
} from './dto/create-utility-pricing.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('Utility')
@Controller('utility')
export class UtilityController {
  constructor(private readonly utilityService: UtilityService) {}

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
}

