import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator"
import mongoose from "mongoose";

export class UpdateEmployeeDto {

    @ApiProperty({
        example: 'name',
        description: "Name of  employee",
        type: "string"
    })
    @IsString()
    name: string

    @ApiProperty({
        example: '123',
        description: "roll number of employee",
        type: "number"
    })
    @IsNumber()
    roll: number;

    @ApiProperty({
        example: '12',
        description: "classname of the employee",
        type: "number"
    })
    @IsNumber()
    classname: number;

    @ApiProperty({
        example: 'password',
        description: "password of user",
        type: "string"
    })
    password: string;


    @ApiProperty({
        example: 'male',
        description: "gender of  the employee",
        type: "string"
    })
    @IsString()
    gender: string;

    @ApiProperty({
        example: '765456765',
        description: "this contains the object id of employee",
        type: "number"
    })
    @IsNumber()
    phone: number;

    @ApiProperty({
        example: 'provide a vaild date string',
        description: "date of birth of the employee",
        type: 'date'
    })
    dob: Date

    @ApiProperty({
        example: 'piyuhs@gmail.com',
        description: "email of the employee",
        type: 'string'
    })
    email: string

    @ApiProperty({
        example: '76543456765434',
        description: "Aadhar number of the employee",
        type: 'string'
    })
    aadharNumber: string


    @ApiProperty({
        example: '6545654GFD54',
        description: "driving licence number of the  employee",
        type:'string'
    })
    dlNumber: string

    @ApiProperty({
        example: 'noida',
        description: "address of the  employee",
        type:'string'
    })
    address: string

}