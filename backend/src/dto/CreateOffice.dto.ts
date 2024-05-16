import { ApiProperty } from "@nestjs/swagger"
import {IsNumber, IsString } from "class-validator"


export class CreateOfficeDto {
    @ApiProperty({
        example: '1234',
        description: "office id should be unique",
        type:'number'
    })
    @IsNumber()
    officeId:number

    @ApiProperty({
        example: 'Haridwar central office',
        description: "provide the office name",
        type:'string'
    })
    @IsString()
    officeName:string

    @ApiProperty({
        example: 'uttarakhand',
        description: "provide the state of the office",
        type:'string'
    })
    @IsString()
    state:string

    @ApiProperty({
        example: 'haridwar',
        description: "provide the city of the office",
        type:'string'
    })
    @IsString()
    city:string

    @ApiProperty({
        example: 'shivalik nagar',
        description: "provide the nearby location of the office",
        type:'string'
    })
    @IsString()
    locality:string

    @ApiProperty({
        example: '78.6543454',
        description: "provide longitude of the office",
        type:'number'
    })
    @IsNumber()
    longitude:number

    @ApiProperty({
        example: '29.65345654',
        description: "provide the latitude of the office",
        type:'number'
    })
    @IsNumber()
    latitude:number

    @ApiProperty({
        example: '249402',
        description: "provide the pin code of the office location",
        type:'string'
    })
    @IsString()
    pincode:string

    @ApiProperty({
        example: 'India',
        description: "provide the country name of the office",
        type:'string'
    })
    @IsString()
    country:string

}