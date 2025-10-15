import {
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { Public } from '../../common/decorators/auth.decorator';

@ApiTags('Delivery - Stores')
@Controller('delivery/stores')
export class DeliveryStoreController {
  constructor(private readonly storeService: StoreService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'جلب المتاجر - عام' })
  async findStores(
    @Query() pagination: CursorPaginationDto,
    @Query('categoryId') categoryId?: string,
    @Query('isTrending') isTrending?: boolean,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('usageType') usageType?: string,
  ) {
    return this.storeService.findStores(pagination, {
      categoryId,
      isTrending,
      isFeatured,
      usageType,
    });
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'البحث عن متاجر' })
  async searchStores(
    @Query('q') query: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.storeService.searchStores(query, pagination);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'جلب متجر محدد' })
  async findStore(@Param('id') id: string) {
    return this.storeService.findStoreById(id);
  }

  @Public()
  @Get(':id/products')
  @ApiOperation({ summary: 'جلب منتجات المتجر' })
  async getProducts(
    @Param('id') storeId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.storeService.findProductsByStore(storeId, pagination);
  }

  @Public()
  @Get(':id/statistics')
  @ApiOperation({ summary: 'إحصائيات المتجر - عامة' })
  async getStoreStatistics(@Param('id') storeId: string) {
    return this.storeService.getStoreStatistics(storeId);
  }

  @Public()
  @Get(':id/reviews')
  @ApiOperation({ summary: 'مراجعات المتجر' })
  async getStoreReviews(
    @Param('id') storeId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.storeService.getStoreReviews(storeId, pagination);
  }
}

