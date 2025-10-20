import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Amani, AmaniSchema } from './entities/amani.entity';
import { AmaniController } from './amani.controller';
import { AmaniService } from './amani.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Amani.name, schema: AmaniSchema }]),
    
  ],
  controllers: [AmaniController],
  providers: [AmaniService],
  exports: [AmaniService],
})
export class AmaniModule {} 
