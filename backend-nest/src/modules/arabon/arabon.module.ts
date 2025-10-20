import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Arabon, ArabonSchema } from './entities/arabon.entity';
import { ArabonController } from './arabon.controller';
import { ArabonService } from './arabon.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arabon.name, schema: ArabonSchema }]),
    
  ],
  controllers: [ArabonController],
  providers: [ArabonService],
  exports: [ArabonService],
})
export class ArabonModule {} 
