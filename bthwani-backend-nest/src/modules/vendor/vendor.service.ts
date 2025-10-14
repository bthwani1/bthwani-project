import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

  // إنشاء تاجر جديد
  async create(createVendorDto: CreateVendorDto) {
    // التحقق من وجود التاجر
    const existing = await this.vendorModel.findOne({
      phone: createVendorDto.phone,
    });

    if (existing) {
      throw new ConflictException({
        code: 'VENDOR_EXISTS',
        message: 'Vendor already exists',
        userMessage: 'التاجر موجود مسبقاً',
        suggestedAction: 'يرجى استخدام رقم هاتف مختلف',
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(createVendorDto.password, 10);

    // إنشاء التاجر
    const vendor = await this.vendorModel.create({
      ...createVendorDto,
      password: hashedPassword,
      store: new Types.ObjectId(createVendorDto.store),
    });

    return this.sanitizeVendor(vendor);
  }

  // جلب كل التجار
  async findAll(pagination: CursorPaginationDto) {
    const query: any = {};

    if (pagination.cursor) {
      query._id = { $gt: new Types.ObjectId(pagination.cursor) };
    }

    const limit = pagination.limit || 20;
    const items = await this.vendorModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate('store', 'name_ar name_en isActive');

    const hasMore = items.length > limit;
    const results = hasMore ? items.slice(0, -1) : items;

    return {
      data: results.map((v) => this.sanitizeVendor(v)),
      pagination: {
        nextCursor: hasMore ? (results[results.length - 1] as any)._id.toString() : null,
        hasMore,
        limit,
      },
    };
  }

  // جلب تاجر محدد
  async findOne(id: string) {
    const vendor = await this.vendorModel
      .findById(id)
      .populate('store', 'name_ar name_en isActive');

    if (!vendor) {
      throw new NotFoundException({
        code: 'VENDOR_NOT_FOUND',
        message: 'Vendor not found',
        userMessage: 'التاجر غير موجود',
      });
    }

    return this.sanitizeVendor(vendor);
  }

  // تحديث بيانات التاجر
  async update(id: string, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.vendorModel.findByIdAndUpdate(
      id,
      updateVendorDto,
      { new: true },
    );

    if (!vendor) {
      throw new NotFoundException({
        code: 'VENDOR_NOT_FOUND',
        message: 'Vendor not found',
        userMessage: 'التاجر غير موجود',
      });
    }

    return this.sanitizeVendor(vendor);
  }

  // تحديث إحصائيات المبيعات
  async updateSalesStats(vendorId: string, revenue: number) {
    const vendor = await this.vendorModel.findByIdAndUpdate(
      vendorId,
      {
        $inc: {
          salesCount: 1,
          totalRevenue: revenue,
        },
      },
      { new: true },
    );

    return this.sanitizeVendor(vendor);
  }

  // إزالة كلمة المرور من الرد
  private sanitizeVendor(vendor: any) {
    const vendorObject = vendor.toObject ? vendor.toObject() : vendor;
    delete vendorObject.password;
    return vendorObject;
  }
}
