import { ApiProperty } from "@nestjs/swagger"
import {IsNumber, IsString } from "class-validator"


export class AddOrderDto {
    @ApiProperty({
        example:'Products',
        description:"a array of products",
        type:"any"
    })
    products:any []

    @ApiProperty({
        example:'65cd8eabd64714bc4b07f32b',
        description:'it contains the object id of the user'
    })
    @IsString()
    buyer:string

    @ApiProperty({
        example:'Payment Done',
        description:"it contains the payment status"
    })
    @IsString()
    payment:string

}