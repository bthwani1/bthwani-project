import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../auth/entities/user.entity';
import { Order, OrderSchema } from '../order/entities/order.entity';
import { Driver, DriverSchema } from '../driver/entities/driver.entity';
import { Vendor, VendorSchema } from '../vendor/entities/vendor.entity';
import { Store, StoreSchema } from '../store/entities/store.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Store.name, schema: StoreSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
