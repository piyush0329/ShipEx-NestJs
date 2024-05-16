import { ApiProperty } from "@nestjs/swagger"
import {IsNumber, IsString } from "class-validator"


export class CreateVehicleDto {
    @ApiProperty({
        example: 'UK08HK4323',
        description: "vehicle number",
        type:'string'
    })
    @IsString()
    vehicleNo:string

    @ApiProperty({
        example: 'tata truck',
        description: "provide the  model name",
        type:'string'
    })
    @IsString()
    model_name:string

    @ApiProperty({
        example: '65',
        description: "provide the capacity of the  vehicle",
        type:'number'
    })
    capacity:number

    @ApiProperty({
        example: 'ramesh singh',
        description: "provide the name of driver",
        type:'string'
    })
    @IsString()
    driver:string

}