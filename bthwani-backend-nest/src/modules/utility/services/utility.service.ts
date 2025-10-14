import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilityPricing } from '../entities/utility-pricing.entity';
import {
  CreateUtilityPricingDto,
  UpdateUtilityPricingDto,
  CalculateUtilityPriceDto,
} from '../dto/create-utility-pricing.dto';
import { getDistance } from 'geolib';

@Injectable()
export class UtilityService {
  constructor(
    @InjectModel(UtilityPricing.name)
    private utilityPricingModel: Model<UtilityPricing>,
  ) {}

  /**
   * إنشاء تسعير جديد لمدينة
   */
  async create(dto: CreateUtilityPricingDto): Promise<UtilityPricing> {
    const existing = await this.utilityPricingModel.findOne({
      city: dto.city,
    });

    if (existing) {
      throw new BadRequestException('تسعير هذه المدينة موجود بالفعل');
    }

    const pricing = new this.utilityPricingModel(dto);
    return pricing.save();
  }

  /**
   * تحديث تسعير مدينة
   */
  async update(
    city: string,
    dto: UpdateUtilityPricingDto,
  ): Promise<UtilityPricing> {
    const pricing = await this.utilityPricingModel.findOne({ city });
    if (!pricing) {
      throw new NotFoundException('تسعير المدينة غير موجود');
    }

    if (dto.isActive !== undefined) pricing.isActive = dto.isActive;
    if (dto.gas) pricing.gas = dto.gas as any;
    if (dto.water) pricing.water = dto.water as any;

    return pricing.save();
  }

  /**
   * الحصول على خيارات المدينة (للعميل)
   */
  async getOptions(city: string = 'صنعاء') {
    const cfg = await this.utilityPricingModel
      .findOne({ city, isActive: true })
      .lean();

    if (!cfg) {
      throw new NotFoundException('لا توجد إعدادات تسعير لهذه المدينة');
    }

    return {
      city,
      gas: cfg.gas?.enabled
        ? {
            cylinderSizeLiters: cfg.gas.cylinderSizeLiters,
            pricePerCylinder: cfg.gas.pricePerCylinder,
            minQty: cfg.gas.minQty ?? 1,
            deliveryPolicy: cfg.gas.deliveryOverride?.policy ?? 'strategy',
            flatFee: cfg.gas.deliveryOverride?.flatFee ?? null,
          }
        : null,
      water: cfg.water?.enabled
        ? {
            sizes: cfg.water.sizes,
            allowHalf: cfg.water.allowHalf,
            halfPolicy: cfg.water.halfPricingPolicy,
            deliveryPolicy: cfg.water.deliveryOverride?.policy ?? 'strategy',
            flatFee: cfg.water.deliveryOverride?.flatFee ?? null,
          }
        : null,
    };
  }

  /**
   * حساب سعر خدمة utility
   */
  async calculatePrice(dto: CalculateUtilityPriceDto) {
    const city = dto.city || 'صنعاء';
    const cfg = await this.utilityPricingModel.findOne({
      city,
      isActive: true,
    });

    if (!cfg) {
      throw new NotFoundException('لا توجد إعدادات تسعير لهذه المدينة');
    }

    let productPrice = 0;
    let deliveryFee = 0;

    if (dto.serviceType === 'gas') {
      if (!cfg.gas?.enabled) {
        throw new BadRequestException('خدمة الغاز غير متاحة في هذه المدينة');
      }

      const quantity = dto.quantity || 1;
      if (quantity < (cfg.gas.minQty || 1)) {
        throw new BadRequestException(
          `الحد الأدنى للكمية هو ${cfg.gas.minQty}`,
        );
      }

      productPrice = cfg.gas.pricePerCylinder * quantity;

      // حساب رسوم التوصيل
      if (cfg.gas.deliveryOverride?.policy === 'flat') {
        deliveryFee = cfg.gas.deliveryOverride.flatFee || 0;
      } else {
        // حساب بناءً على المسافة
        deliveryFee = this.calculateDeliveryFee(
          cfg.origins?.gas,
          dto.customerLocation,
        );
      }
    } else if (dto.serviceType === 'water') {
      if (!cfg.water?.enabled) {
        throw new BadRequestException('خدمة الماء غير متاحة في هذه المدينة');
      }

      const sizeConfig = cfg.water.sizes.find((s) => s.key === dto.size);
      if (!sizeConfig) {
        throw new BadRequestException('الحجم المطلوب غير متاح');
      }

      if (dto.half) {
        if (!cfg.water.allowHalf) {
          throw new BadRequestException('نصف الوايت غير متاح');
        }

        // حساب سعر نصف الوايت
        if (cfg.water.halfPricingPolicy === 'linear') {
          productPrice =
            sizeConfig.pricePerTanker * (cfg.water.halfLinearFactor || 0.5);
        } else if (cfg.water.halfPricingPolicy === 'multiplier') {
          productPrice =
            sizeConfig.pricePerTanker * (cfg.water.halfMultiplier || 0.6);
        } else {
          productPrice = cfg.water.halfFixedAmount || 0;
        }
      } else {
        productPrice = sizeConfig.pricePerTanker;
      }

      // حساب رسوم التوصيل
      if (cfg.water.deliveryOverride?.policy === 'flat') {
        deliveryFee = cfg.water.deliveryOverride.flatFee || 0;
      } else {
        deliveryFee = this.calculateDeliveryFee(
          cfg.origins?.water,
          dto.customerLocation,
        );
      }
    }

    return {
      productPrice: Math.round(productPrice),
      deliveryFee: Math.round(deliveryFee),
      total: Math.round(productPrice + deliveryFee),
      breakdown: {
        serviceType: dto.serviceType,
        city,
        ...(dto.serviceType === 'gas' && { quantity: dto.quantity }),
        ...(dto.serviceType === 'water' && {
          size: dto.size,
          half: dto.half,
        }),
      },
    };
  }

  /**
   * حساب رسوم التوصيل بناءً على المسافة
   */
  private calculateDeliveryFee(
    origin?: { lat: number; lng: number },
    customerLocation?: { lat: number; lng: number },
  ): number {
    if (!origin || !customerLocation) {
      return 500; // رسوم افتراضية
    }

    const distanceMeters = getDistance(
      { latitude: origin.lat, longitude: origin.lng },
      {
        latitude: customerLocation.lat,
        longitude: customerLocation.lng,
      },
    );

    const distanceKm = distanceMeters / 1000;

    // تسعير بسيط: 100 ريال لكل كيلومتر + 200 رسوم أساسية
    return Math.round(200 + distanceKm * 100);
  }

  /**
   * الحصول على كل التسعيرات (admin)
   */
  async findAll(): Promise<any[]> {
    return this.utilityPricingModel.find().sort({ city: 1 }).lean().exec();
  }

  /**
   * الحصول على تسعير مدينة
   */
  async findByCity(city: string): Promise<UtilityPricing> {
    const pricing = await this.utilityPricingModel.findOne({ city });
    if (!pricing) {
      throw new NotFoundException('تسعير المدينة غير موجود');
    }
    return pricing;
  }

  /**
   * حذف تسعير مدينة
   */
  async delete(city: string): Promise<void> {
    const result = await this.utilityPricingModel.findOneAndDelete({ city });
    if (!result) {
      throw new NotFoundException('تسعير المدينة غير موجود');
    }
  }
}

