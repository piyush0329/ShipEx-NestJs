import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { User } from "./user.schema";
import mongoose, { Document } from "mongoose";
import { Order } from "./order.schema";


@Schema({ timestamps: true })
export class Payment extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    buyer: User

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Order' })
    order:Order

    @Prop()
    sessionId:string

    @Prop({ default: 'Not Done', enum: ['Not Done', 'Pending', 'Cancelled', 'Payment Done', 'Refunded'] })
    paymentStatus:string

    @Prop()
    refundId:string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);