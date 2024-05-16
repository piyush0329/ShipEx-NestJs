import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator"
import mongoose from "mongoose";

export class CreateUserDto {

    @ApiProperty({
        example: 'amit',
        description: "name of  the user",
        type:'string'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: '65',
        description: "provide the roll number of the user",
        type:'number'
    })
    @IsNumber()
    roll: number;

    @ApiProperty({
        example: 'amit@gmail.com',
        description: "provide the email of the user",
        type:'string'
    })
    @IsEmail()
    email: string

    @ApiProperty({
        example: '6',
        description: "provide the classname of the user",
        type:'number'
    })
    @IsNumber()
    classname: number;

    @ApiProperty({
        example: '123456',
        description: "provide the password of the user",
        type:'string'
    })
    @IsString()
    password: string;

    @ApiProperty({
        example: 'male',
        description: "provide the gender of the user",
        type:'string'
    })
    @IsString()
    gender: string;

    @ApiProperty({
        example: '6555434543',
        description: "provide the phone number of the user",
        type:'number'
    })
    @IsNumber()
    phone: number;

    @ApiProperty({
        example: '23/12/2343',
        description: "provide the dateofbirth of the user",
        type:'date'
    })
    dob?: Date

    
    role?: string;
    
    employeeDetails?: mongoose.Schema.Types.ObjectId


}