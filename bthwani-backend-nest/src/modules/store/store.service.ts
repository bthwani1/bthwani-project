import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store } from './entities/store.entity';
import { Product } from './entities/product.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // Stores
  async createStore(createStoreDto: CreateStoreDto) {
    const store = await this.storeModel.create(createStoreDto);
    return store;
  }

  async findStores(pagination: CursorPaginationDto) {
    const query: any = { isActive: true };
    if (pagination.cursor) query._id = { $gt: new Types.ObjectId(pagination.cursor) };

    const limit = pagination.limit || 20;
    const items = await this.storeModel.find(query).sort({ createdAt: -1 }).limit(limit + 1);
    const hasMore = items.length > limit;
    const results = hasMore ? items.slice(0, -1) : items;

    return {
      data: results,
      pagination: {
        nextCursor: hasMore ? (results[results.length - 1] as any)._id.toString() : null,
        hasMore,
        limit,
      },
    };
  }

  async findStoreById(id: string) {
    const store = await this.storeModel.findById(id);
    if (!store) {
      throw new NotFoundException({ code: 'STORE_NOT_FOUND', userMessage: 'المتجر غير موجود' });
    }
    return store;
  }

  // Products
  async createProduct(createProductDto: CreateProductDto) {
    const product = await this.productModel.create({
      ...createProductDto,
      store: new Types.ObjectId(createProductDto.store),
      finalPrice: createProductDto.price - (createProductDto.discount || 0),
    });
    return product;
  }

  async findProductsByStore(storeId: string, pagination: CursorPaginationDto) {
    const query: any = { store: new Types.ObjectId(storeId), isActive: true };
    if (pagination.cursor) query._id = { $gt: new Types.ObjectId(pagination.cursor) };

    const limit = pagination.limit || 20;
    const items = await this.productModel.find(query).sort({ createdAt: -1 }).limit(limit + 1);
    const hasMore = items.length > limit;
    const results = hasMore ? items.slice(0, -1) : items;

    return {
      data: results,
      pagination: {
        nextCursor: hasMore ? (results[results.length - 1] as any)._id.toString() : null,
        hasMore,
        limit,
      },
    };
  }

  async updateStore(storeId: string, updates: any) {
    const store = await this.storeModel.findByIdAndUpdate(storeId, updates, { new: true });
    if (!store) {
      throw new NotFoundException({ code: 'STORE_NOT_FOUND', userMessage: 'المتجر غير موجود' });
    }
    return store;
  }

  async getStoreStatistics(storeId: string) {
    // TODO: Aggregate from orders
    return {
      totalOrders: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalProducts: 0,
    };
  }

  async updateProduct(productId: string, updates: any) {
    const product = await this.productModel.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) {
      throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', userMessage: 'المنتج غير موجود' });
    }
    return product;
  }

  // ==================== Store Extended Features ====================

  async getStoreReviews(storeId: string, pagination: any) {
    // TODO: Implement reviews from Order ratings
    return { data: [], total: 0, averageRating: 0 };
  }

  async getStoreAnalytics(storeId: string, startDate?: string, endDate?: string) {
    // TODO: Aggregate from orders
    return {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      topProducts: [],
      revenueByDay: [],
    };
  }

  async getProductVariants(productId: string) {
    // TODO: Implement product variants
    return { data: [] };
  }

  async addProductVariant(productId: string, variant: any) {
    // TODO: Implement product variants
    return { success: true, message: 'تم إضافة المتغير', variant };
  }

  async getStoreInventory(storeId: string) {
    const products = await this.productModel.find({ store: new Types.ObjectId(storeId) });
    
    return {
      totalProducts: products.length,
      lowStock: products.filter(p => (p as any).stock < 10).length,
      outOfStock: products.filter(p => (p as any).stock === 0).length,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        stock: (p as any).stock || 0,
        price: p.price,
      })),
    };
  }
}
