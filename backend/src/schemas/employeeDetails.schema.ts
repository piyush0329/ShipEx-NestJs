import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

//import mongoose from "mongoose";

export type EmployeeDetailsDocument = HydratedDocument<EmployeeDetails>;

@Schema({timestamps:true})

export class EmployeeDetails extends Document {
  @Prop({required:true,trim:true})
  aadharNumber: string;

  @Prop({required:true})
  dlNumber: string;

  @Prop({required:true})
  address: string;

}

export const EmployeeDetailsSchema = SchemaFactory.createForClass(EmployeeDetails);


