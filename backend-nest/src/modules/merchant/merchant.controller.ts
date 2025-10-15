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
import { MerchantService } from './services/merchant.service';
import {
  CreateMerchantDto,
  UpdateMerchantDto,
} from './dto/create-merchant.dto';
import {
  CreateMerchantProductDto,
  UpdateMerchantProductDto,
} from './dto/create-merchant-product.dto';
import {
  CreateProductCatalogDto,
  UpdateProductCatalogDto,
} from './dto/create-product-catalog.dto';
import {
  CreateMerchantCategoryDto,
  UpdateMerchantCategoryDto,
} from './dto/create-category.dto';
import {
  CreateAttributeDto,
  UpdateAttributeDto,
} from './dto/create-attribute.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('Merchant')
@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  // ==================== Merchant Endpoints ====================

  @Post()
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء تاجر جديد' })
  async createMerchant(@Body() dto: CreateMerchantDto) {
    return this.merchantService.createMerchant(dto);
  }

  @Get()
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على كل التجار' })
  async getAllMerchants(@Query('isActive') isActive?: boolean) {
    return this.merchantService.findAllMerchants(isActive);
  }

  @Get(':id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على تاجر محدد' })
  async getMerchant(@Param('id') id: string) {
    return this.merchantService.findMerchantById(id);
  }

  @Patch(':id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث تاجر' })
  async updateMerchant(
    @Param('id') id: string,
    @Body() dto: UpdateMerchantDto,
  ) {
    return this.merchantService.updateMerchant(id, dto);
  }

  @Delete(':id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف تاجر' })
  async deleteMerchant(@Param('id') id: string) {
    await this.merchantService.deleteMerchant(id);
    return { message: 'تم حذف التاجر بنجاح' };
  }

  // ==================== Product Catalog Endpoints ====================

  @Post('catalog/products')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة منتج للكتالوج' })
  async createProductCatalog(@Body() dto: CreateProductCatalogDto) {
    return this.merchantService.createProductCatalog(dto);
  }

  @Get('catalog/products')
  @ApiOperation({ summary: 'الحصول على منتجات الكتالوج (public)' })
  async getAllProductCatalogs(@Query('usageType') usageType?: string) {
    return this.merchantService.findAllProductCatalogs(usageType);
  }

  @Get('catalog/products/:id')
  @ApiOperation({ summary: 'الحصول على منتج من الكتالوج (public)' })
  async getProductCatalog(@Param('id') id: string) {
    return this.merchantService.findProductCatalogById(id);
  }

  @Patch('catalog/products/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث منتج في الكتالوج' })
  async updateProductCatalog(
    @Param('id') id: string,
    @Body() dto: UpdateProductCatalogDto,
  ) {
    return this.merchantService.updateProductCatalog(id, dto);
  }

  // ==================== Merchant Product Endpoints ====================

  @Get('products')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الحصول على جميع منتجات التجار' })
  async getAllMerchantProducts(
    @Query('merchantId') merchantId?: string,
    @Query('storeId') storeId?: string,
    @Query('isAvailable') isAvailable?: boolean,
  ) {
    return this.merchantService.findAllMerchantProducts({
      merchantId,
      storeId,
      isAvailable,
    });
  }

  @Post('products')
  @Auth(AuthType.VENDOR_JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة منتج لمتجر التاجر' })
  async createMerchantProduct(@Body() dto: CreateMerchantProductDto) {
    return this.merchantService.createMerchantProduct(dto);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'الحصول على منتج تاجر محدد' })
  async getMerchantProduct(@Param('id') id: string) {
    return this.merchantService.findMerchantProductById(id);
  }

  @Get(':merchantId/products')
  @ApiOperation({ summary: 'منتجات التاجر (public)' })
  async getMerchantProducts(
    @Param('merchantId') merchantId: string,
    @Query('storeId') storeId?: string,
    @Query('isAvailable') isAvailable?: boolean,
  ) {
    return this.merchantService.findMerchantProducts(
      merchantId,
      storeId,
      isAvailable,
    );
  }

  @Get('stores/:storeId/products')
  @ApiOperation({ summary: 'منتجات المتجر (public)' })
  async getStoreProducts(
    @Param('storeId') storeId: string,
    @Query('sectionId') sectionId?: string,
  ) {
    return this.merchantService.findStoreProducts(storeId, sectionId);
  }

  @Patch('products/:id')
  @Auth(AuthType.VENDOR_JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث منتج التاجر' })
  async updateMerchantProduct(
    @Param('id') id: string,
    @Body() dto: UpdateMerchantProductDto,
  ) {
    return this.merchantService.updateMerchantProduct(id, dto);
  }

  @Patch('products/:id/stock')
  @Auth(AuthType.VENDOR_JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث مخزون منتج' })
  async updateStock(
    @Param('id') id: string,
    @Body() dto: { quantity: number },
  ) {
    return this.merchantService.updateStock(id, dto.quantity);
  }

  @Delete('products/:id')
  @Auth(AuthType.VENDOR_JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف منتج تاجر' })
  async deleteMerchantProduct(@Param('id') id: string) {
    await this.merchantService.deleteMerchantProduct(id);
    return { message: 'تم حذف المنتج بنجاح' };
  }

  // ==================== Category Endpoints ====================

  @Post('categories')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء فئة منتجات' })
  async createCategory(@Body() dto: CreateMerchantCategoryDto) {
    return this.merchantService.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'الحصول على الفئات (public)' })
  async getCategories(@Query('parent') parent?: string) {
    return this.merchantService.findAllCategories(parent);
  }

  @Patch('categories/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث فئة' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateMerchantCategoryDto,
  ) {
    return this.merchantService.updateCategory(id, dto);
  }

  // ==================== Attribute Endpoints ====================

  @Post('attributes')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء خاصية منتج' })
  async createAttribute(@Body() dto: CreateAttributeDto) {
    return this.merchantService.createAttribute(dto);
  }

  @Get('attributes')
  @ApiOperation({ summary: 'الحصول على الخصائص (public)' })
  async getAttributes() {
    return this.merchantService.findAllAttributes();
  }

  @Patch('attributes/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث خاصية' })
  async updateAttribute(
    @Param('id') id: string,
    @Body() dto: UpdateAttributeDto,
  ) {
    return this.merchantService.updateAttribute(id, dto);
  }
}
