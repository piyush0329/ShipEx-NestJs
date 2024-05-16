import { ApiProperty } from "@nestjs/swagger"
import {IsNumber, IsString } from "class-validator"
import mongoose from "mongoose"


export class CreateRefundDto {
    @ApiProperty({
        example: 'order object',
        description: "this contain the order object",
        type:'any'
    })
    order:any

    @ApiProperty({
        example: 'sdf32454gdfdfgfd',
        description: "provide the object id of the user",
        type:'string'
    })
    userId:string

}