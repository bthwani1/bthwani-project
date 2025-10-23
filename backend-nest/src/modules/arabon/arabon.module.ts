import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Arabon, ArabonSchema } from './entities/arabon.entity';
import { ArabonController } from './arabon.controller';
import { ArabonService } from './arabon.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arabon.name, schema: ArabonSchema }]),
    JwtModule.register({}),
  ],
  controllers: [ArabonController],
  providers: [ArabonService],
  exports: [ArabonService],
})
export class ArabonModule {}
