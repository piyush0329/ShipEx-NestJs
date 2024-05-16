import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EmployeeDetails } from './employeeDetails.schema';

//import mongoose from "mongoose";

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({timestamps:true})
export class User extends Document {

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  roll: number;

  @Prop({ unique: true, required: true, trim: true })
  email: string;

  @Prop({ required: true })
  classname: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  phone: number;

  @Prop({  })
  dob: Date;

  @Prop({ required: true, default: 'user', trim:true })
  role: string;

  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: "EmployeeDetails" })
  employeeDetails: EmployeeDetails
}

export const UserSchema = SchemaFactory.createForClass(User);




