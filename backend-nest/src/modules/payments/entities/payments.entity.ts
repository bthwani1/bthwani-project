import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payments extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: 'draft' })
  status: string;
}

export const PaymentsSchema = SchemaFactory.createForClass(Payments);
