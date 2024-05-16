
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Office } from './office.schema';
import { User } from './user.schema';

export type ProductDocument = mongoose.HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product extends Document {
  
  @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: "Office" })
  startLocation: Office

  @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: "Office" })
  destinationLocation: Office

  @Prop({ required:true })
  weight: number

  @Prop({ required:true })
  description: string
  @Prop({ required:true })
  price: number
  @Prop({ required:true })
  shipmentValue: number

  @Prop({ required:true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userid: User

  @Prop({
    default: { sessionId: null },
    type: {
      sessionId: { type: String, default: null },
    },
  })
  payment: { sessionId: string };

}

export const ProductSchema = SchemaFactory.createForClass(Product);

 