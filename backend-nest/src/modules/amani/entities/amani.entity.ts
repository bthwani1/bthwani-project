import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum AmaniStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Amani extends Document {
  @ApiProperty({
    description: 'معرف المستخدم صاحب الطلب',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @ApiProperty({
    description: 'عنوان الطلب',
    example: 'نقل عائلي من الرياض إلى جدة',
    type: 'string'
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'وصف تفصيلي للطلب',
    example: 'نقل عائلي مكون من 4 أفراد مع أمتعة',
    required: false,
    type: 'string'
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'موقع الانطلاق',
    example: { lat: 24.7136, lng: 46.6753, address: 'الرياض، المملكة العربية السعودية' },
    required: false,
    type: 'object'
  })
  @Prop({ type: Object })
  origin?: any;

  @ApiProperty({
    description: 'الوجهة المطلوبة',
    example: { lat: 21.4858, lng: 39.1925, address: 'جدة، المملكة العربية السعودية' },
    required: false,
    type: 'object'
  })
  @Prop({ type: Object })
  destination?: any;

  @ApiProperty({
    description: 'بيانات إضافية للطلب',
    example: { passengers: 4, luggage: true, specialRequests: 'كرسي أطفال' },
    required: false,
    type: 'object'
  })
  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'حالة الطلب',
    enum: AmaniStatus,
    default: AmaniStatus.DRAFT,
    example: AmaniStatus.DRAFT
  })
  @Prop({ default: 'draft' })
  status: AmaniStatus;

  @ApiProperty({
    description: 'تاريخ الإنشاء',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'تاريخ آخر تحديث',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}

export const AmaniSchema = SchemaFactory.createForClass(Amani);
