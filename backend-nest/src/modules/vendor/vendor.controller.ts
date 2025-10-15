import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  Auth,
  Roles,
  CurrentUser,
} from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Vendor')
@ApiBearerAuth()
@Controller('vendors')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin', 'marketer')
  @Post()
  @ApiOperation({ summary: 'إنشاء تاجر جديد' })
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Get()
  @ApiOperation({ summary: 'جلب كل التجار' })
  async findAll(@Query() pagination: CursorPaginationDto) {
    return this.vendorService.findAll(pagination);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Get('me')
  @ApiOperation({ summary: 'جلب بيانات التاجر الحالي' })
  async getProfile(@CurrentUser('id') vendorId: string) {
    return this.vendorService.findOne(vendorId);
  }

  @Auth(AuthType.JWT)
  @Get(':id')
  @ApiOperation({ summary: 'جلب تاجر محدد' })
  async findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Patch('me')
  @ApiOperation({ summary: 'تحديث بيانات التاجر' })
  async update(
    @CurrentUser('id') vendorId: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.update(vendorId, updateVendorDto);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Patch(':id')
  @ApiOperation({ summary: 'تحديث تاجر (للإدارة)' })
  async updateVendor(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Patch(':id/status')
  @ApiOperation({ summary: 'تحديث حالة التاجر' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.vendorService.update(id, { isActive: body.isActive });
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Post(':id/reset-password')
  @ApiOperation({ summary: 'إعادة تعيين كلمة مرور التاجر' })
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { password: string },
  ) {
    return this.vendorService.resetPassword(id, body.password);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Get('dashboard/overview')
  @ApiOperation({ summary: 'لوحة معلومات التاجر' })
  async getDashboard(@CurrentUser('id') vendorId: string) {
    return this.vendorService.getDashboard(vendorId);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Get('account/statement')
  @ApiOperation({ summary: 'كشف حساب التاجر' })
  async getAccountStatement(@CurrentUser('id') vendorId: string) {
    return this.vendorService.getAccountStatement(vendorId);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Get('settlements')
  @ApiOperation({ summary: 'طلبات التسوية المالية' })
  async getSettlements(@CurrentUser('id') vendorId: string) {
    return this.vendorService.getSettlements(vendorId);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Post('settlements')
  @ApiOperation({ summary: 'طلب تسوية مالية' })
  async createSettlement(
    @CurrentUser('id') vendorId: string,
    @Body() body: { amount: number; bankAccount?: string },
  ) {
    return this.vendorService.createSettlement(vendorId, body);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Get('sales')
  @ApiOperation({ summary: 'سجل المبيعات' })
  async getSales(
    @CurrentUser('id') vendorId: string,
    @Query('limit') limit?: number,
  ) {
    return this.vendorService.getSales(vendorId, limit);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Post('account/delete-request')
  @ApiOperation({ summary: 'طلب حذف الحساب' })
  async requestAccountDeletion(
    @CurrentUser('id') vendorId: string,
    @Body() body: { reason?: string; exportData?: boolean },
  ) {
    return this.vendorService.requestAccountDeletion(vendorId, body);
  }
}
