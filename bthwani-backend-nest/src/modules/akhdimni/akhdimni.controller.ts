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
import {
  AkhdimniService,
  PaginatedOrdersResult,
} from './services/akhdimni.service';
import {
  CreateErrandDto,
  UpdateErrandStatusDto,
  AssignDriverDto,
  RateErrandDto,
} from './dto/create-errand.dto';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('Akhdimni')
@Controller('akhdimni')
@ApiBearerAuth()
export class AkhdimniController {
  constructor(private readonly akhdimniService: AkhdimniService) {}

  // ==================== Customer Endpoints ====================

  @Post('errands')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إنشاء طلب مهمة (أخدمني)' })
  async createErrand(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateErrandDto,
  ) {
    return this.akhdimniService.create(userId, dto);
  }

  @Get('my-errands')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'طلباتي من أخدمني' })
  async getMyErrands(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
  ) {
    return this.akhdimniService.getMyOrders(userId, status);
  }

  @Get('errands/:id')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'الحصول على طلب محدد' })
  async getErrand(@Param('id') id: string) {
    return this.akhdimniService.findById(id);
  }

  @Patch('errands/:id/cancel')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'إلغاء طلب' })
  async cancelErrand(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.akhdimniService.cancel(id, dto.reason);
  }

  @Post('errands/:id/rate')
  @Auth(AuthType.FIREBASE)
  @ApiOperation({ summary: 'تقييم المهمة' })
  async rateErrand(@Param('id') id: string, @Body() dto: RateErrandDto) {
    return this.akhdimniService.rate(id, dto);
  }

  // ==================== Driver Endpoints ====================

  @Get('driver/my-errands')
  @Auth(AuthType.FIREBASE)
  @Roles('driver')
  @ApiOperation({ summary: 'مهماتي كسائق' })
  async getMyDriverErrands(
    @CurrentUser('id') driverId: string,
    @Query('status') status?: string,
  ) {
    return this.akhdimniService.getDriverOrders(driverId, status);
  }

  @Patch('errands/:id/status')
  @Auth(AuthType.FIREBASE)
  @Roles('driver')
  @ApiOperation({ summary: 'تحديث حالة المهمة (سائق)' })
  async updateErrandStatus(
    @Param('id') id: string,
    @Body() dto: UpdateErrandStatusDto,
  ) {
    return this.akhdimniService.updateStatus(id, dto);
  }

  // ==================== Admin Endpoints ====================

  @Get('admin/errands')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'كل طلبات أخدمني (إدارة)' })
  async getAllErrands(
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
  ): Promise<PaginatedOrdersResult> {
    return this.akhdimniService.getAllOrders(status, limit, cursor);
  }

  @Post('admin/errands/:id/assign-driver')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'تعيين سائق لمهمة' })
  async assignDriver(@Param('id') id: string, @Body() dto: AssignDriverDto) {
    return this.akhdimniService.assignDriver(id, dto.driverId);
  }
}
