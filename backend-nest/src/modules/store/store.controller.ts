import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, Roles, Public } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Store')
@Controller('stores')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Post()
  @ApiOperation({ summary: 'إنشاء متجر' })
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'جلب المتاجر' })
  async findStores(@Query() pagination: CursorPaginationDto) {
    return this.storeService.findStores(pagination);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'جلب متجر محدد' })
  async findStore(@Param('id') id: string) {
    return this.storeService.findStoreById(id);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Post('products')
  @ApiOperation({ summary: 'إنشاء منتج' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.storeService.createProduct(createProductDto);
  }

  @Public()
  @Get(':id/products')
  @ApiOperation({ summary: 'جلب منتجات المتجر' })
  async getProducts(@Param('id') storeId: string, @Query() pagination: CursorPaginationDto) {
    return this.storeService.findProductsByStore(storeId, pagination);
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin', 'vendor')
  @Patch(':id')
  @ApiOperation({ summary: 'تحديث متجر' })
  async updateStore(@Param('id') storeId: string, @Body() updates: any) {
    return this.storeService.updateStore(storeId, updates);
  }

  @Public()
  @Get(':id/statistics')
  @ApiOperation({ summary: 'إحصائيات المتجر' })
  async getStoreStatistics(@Param('id') storeId: string) {
    return this.storeService.getStoreStatistics(storeId);
  }

  @Auth(AuthType.VENDOR_JWT)
  @Patch('products/:id')
  @ApiOperation({ summary: 'تحديث منتج' })
  async updateProduct(@Param('id') productId: string, @Body() updates: any) {
    return this.storeService.updateProduct(productId, updates);
  }

  // ==================== Store Extended Features ====================

  @Get(':id/reviews')
  @ApiOperation({ summary: 'مراجعات المتجر' })
  async getStoreReviews(@Param('id') storeId: string, @Query() pagination: CursorPaginationDto) {
    return this.storeService.getStoreReviews(storeId, pagination);
  }

  @Get(':id/analytics')
  @Auth(AuthType.VENDOR_JWT)
  @ApiOperation({ summary: 'تحليلات المتجر' })
  async getStoreAnalytics(
    @Param('id') storeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.storeService.getStoreAnalytics(storeId, startDate, endDate);
  }

  @Get('products/:id/variants')
  @ApiOperation({ summary: 'متغيرات المنتج' })
  async getProductVariants(@Param('id') productId: string) {
    return this.storeService.getProductVariants(productId);
  }

  @Post('products/:id/variants')
  @Auth(AuthType.VENDOR_JWT)
  @ApiOperation({ summary: 'إضافة متغير' })
  async addProductVariant(@Param('id') productId: string, @Body() variant: any) {
    return this.storeService.addProductVariant(productId, variant);
  }

  @Get(':id/inventory')
  @Auth(AuthType.VENDOR_JWT)
  @ApiOperation({ summary: 'جرد المتجر' })
  async getStoreInventory(@Param('id') storeId: string) {
    return this.storeService.getStoreInventory(storeId);
  }
}
