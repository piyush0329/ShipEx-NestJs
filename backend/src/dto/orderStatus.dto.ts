import { ApiProperty } from "@nestjs/swagger"
import {IsNumber, IsString } from "class-validator"


export class OrderStatusDto {
     
    @ApiProperty({
        example: 'Not Process',
        description: "It contains order status like not process,shipped,delivered, etc.",
        type:'string'
    })
    @IsString()
    status:string

    @ApiProperty({
        example: '65d5d73eebf12241b489a609',
        description: "object id of user",
        type:'string'
    })
    userId:string

}