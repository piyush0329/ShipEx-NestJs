
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose";



@Schema({ timestamps: true })
export class Vehicle extends Document {

    @Prop({ required:true, unique:true, trim:true })
    vehicleNo: string

    @Prop({required:true, trim:true})
    model_name:string

    @Prop()
    capacity:number

    @Prop({required:true})
    driver:string

    @Prop({ default:"Free", trim:true, required:true })
    status:string
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

