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
}
