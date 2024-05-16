import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose";
import { Vehicle } from "./vehicle.schema";
import { Order } from "./order.schema";

@Schema({ timestamps: true })
export class DeliveryMapping extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' })
    vehicleId: Vehicle

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] })
    orders: Order[];

    @Prop()
    shiping_status:string

    @Prop()
    arrival_time:Date

    @Prop()
    departure_time:string
}

export const DeliveryMappingSchema = SchemaFactory.createForClass(DeliveryMapping);

