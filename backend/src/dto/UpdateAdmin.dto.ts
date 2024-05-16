import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator"

export class UpdateAdminDto {

    @ApiProperty({
        example: 'amit',
        description: "name of admin",
        type:'string'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: '12',
        description: "roll no  of admin",
        type:'number'
    })
    @IsNumber()
    roll: number;

    @ApiProperty({
        example: '12',
        description: "classname of admin",
        type:'number'
    })
    @IsNumber()
    classname: number;

    @ApiProperty({
        example: '123456',
        description: "password of admin",
        type:'string'
    })
    @IsString()
    password: string;

    @ApiProperty({
        example: 'male',
        description: "gender of admin",
        type:'string'
    })
    @IsString()
    gender: string;

    @ApiProperty({
        example: '7654345345',
        description: "phone number of admin",
        type:'number'
    })
    @IsNumber()
    phone: number;

    @ApiProperty({
        example: '23/2/2341',
        description: "provide the date string",
        type:'date'
    })
    dob: Date
    
    @ApiProperty({
        example: 'amit@gmail.com',
        description: "email of admin",
        type:'string'
    })
    email:string

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