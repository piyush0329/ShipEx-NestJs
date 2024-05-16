import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator"


export class UpdateUserDto {


    @ApiProperty({
        example: 'name',
        description: "Name of  user",
        type: "string"
    })
    @IsString()
    name: string

    @ApiProperty({
        example: '2',
        description: "rollnumber of  user",
        type: "number"
    })
    @IsNumber()
    roll: number;

    @ApiProperty({
        example: '12',
        description: "classname of  user",
        type: "number"
    })
    @IsNumber()
    classname: number;

    @ApiProperty({
        example: 'password',
        description: "password of  user",
        type: "string"
    })
    @IsString()
    password: string;

    @ApiProperty({
        example: 'gender',
        description: "gender of  user",
        type: "string"
    })
    @IsString()
    gender: string;

    @ApiProperty({
        example: 'phone number',
        description: "phone number of  user",
        type: "number"
    })
    @IsNumber()
    phone: number;

    @ApiProperty({
        example: 'email',
        description: "email of  user",
        type: "string"
    })
    email?: string;
    
    @ApiProperty({
        example: 'date of birth',
        description: "date of birth of  user",
        type: "string"
    })
    dob?: Date

    role?: string;




}