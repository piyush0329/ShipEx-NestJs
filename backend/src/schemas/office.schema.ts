import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

//import mongoose from "mongoose";

export type OfficeDocument = mongoose.HydratedDocument<Office>;

@Schema({ timestamps: true })
export class Office extends Document {

    @Prop({ unique: true, required: true, trim: true })
    officeId: number;

    @Prop({ required: true, trim: true })
    officeName: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    locality: string;

    @Prop({ required: true })
    longitude: number;

    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    pincode: string;

    @Prop({ required: true, trim: true })
    country: string;

}

export const OfficeSchema = SchemaFactory.createForClass(Office);