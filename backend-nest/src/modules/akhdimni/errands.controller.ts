import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AkhdimniService } from './services/akhdimni.service';
import {
  CreateErrandDto,
  RateErrandDto,
} from './dto/create-errand.dto';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

/**
 * Errands Controller - Alias for Akhdimni
 * This controller provides backward compatibility with frontend apps
 * that use /errands endpoints instead of /akhdimni
 */
@ApiTags('Errands')
@Controller({ path: 'errands', version: ['1', '2'] })
@ApiBearerAuth()
export class ErrandsController {
  constructor(private readonly akhdimniService: AkhdimniService) {}

  @Post('order')
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إنشاء طلب مهمة' })
  async createErrandOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateErrandDto,
  ) {
    return this.akhdimniService.create(userId, dto);
  }

  @Get('user/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'طلبات المستخدم' })
  async getUserErrands(
    @Param('id') userId: string,
    @Query('status') status?: string,
  ) {
    return this.akhdimniService.getMyOrders(userId, status);
  }

  @Get('categories')
  @ApiResponse({ status: 200, description: 'Success' })
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'فئات المهام' })
  async getErrandCategories() {
    // Return static categories for now
    return {
      success: true,
      data: [
        { id: 'delivery', name: 'توصيل', icon: '📦' },
        { id: 'shopping', name: 'تسوق', icon: '🛒' },
        { id: 'errands', name: 'مهام', icon: '📋' },
        { id: 'other', name: 'أخرى', icon: '📌' },
      ],
    };
  }

  @Get('drivers/available')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'السائقون المتاحون' })
  async getAvailableDrivers(
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
  ) {
    // TODO: Implement actual available drivers logic
    return {
      success: true,
      data: [],
      message: 'سيتم عرض السائقين المتاحين قريباً',
    };
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'الحصول على مهمة محددة' })
  async getErrand(@Param('id') id: string) {
    return this.akhdimniService.findById(id);
  }
}

