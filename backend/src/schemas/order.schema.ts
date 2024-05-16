import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { Office } from './office.schema';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop()
  products: any[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Office' })
  startLocation: Office;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Office' })
  destinationLocation: Office;

  @Prop({ default: 'Not Done', enum: ['Not Done', 'Pending', 'Cancelled', 'Payment Done', 'Refunded'] })
  payment: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  buyer: User;

  @Prop({ default: 'Not Process', enum: ['Created', 'Not Process', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'] })
  status: string;

  @Prop({ type: Number })
  totalAmount: number;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: null })
  refundDetails:any

  @Prop({ type: Date, default: null })
  expectedDelivery: Date;

  @Prop()
  timeLine: any[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
