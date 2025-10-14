import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UtilityController } from './utility.controller';
import { UtilityService } from './services/utility.service';
import {
  UtilityPricing,
  UtilityPricingSchema,
} from './entities/utility-pricing.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UtilityPricing.name, schema: UtilityPricingSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [UtilityController],
  providers: [UtilityService],
  exports: [UtilityService],
})
export class UtilityModule {}

