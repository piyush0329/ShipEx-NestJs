import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose";
import { Vehicle } from "./vehicle.schema";
import { Order } from "./order.schema";
import { Office } from "./office.schema";
import { User } from "./user.schema";

@Schema({ timestamps: true })
export class OrderLog extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
    orderId: Order

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Office', default:null })
    location: Office

    @Prop()
    order_status:string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User

}

export const OrderLogSchema = SchemaFactory.createForClass(OrderLog);

        
    
      