import { ApiProperty } from "@nestjs/swagger"
import {  IsEmail } from "class-validator"
import mongoose from "mongoose"


export class ProductDto{

    @ApiProperty({
        example: '65d5d73eebf12241b489a609',
        description: "object id of office",
        type:'mongoose.Schema.Types.ObjectId'
    })
    startLocation: mongoose.Schema.Types.ObjectId

    @ApiProperty({
        example: '65d5d73eebf12241b489a609',
        description: "object id of office",
        type:'mongoose.Schema.Types.ObjectId'
    })
    destinationLocation: mongoose.Schema.Types.ObjectId

    @ApiProperty({
        example: '30',
        description: "weight of shipment",
        type:'number'
    })
    weight:number

    @ApiProperty({
        example: 'books',
        description: "description of shipment",
        type:'string'
    })
    description:string
    
    @ApiProperty({
        example: '123',
        description: "price of shipping",
        type:'number'
    })
    price:number

    @ApiProperty({
        example: '5000',
        description: "shipment value",
        type:'number'
    })
    shipmentValue:number

    @ApiProperty({
        example: '65d5d73eebf12241b489a609',
        description: "object id of user",
        type:'mongoose.Schema.Types.ObjectId'
    })
    userid: mongoose.Schema.Types.ObjectId

    
    payment?:{
        sessionId:string
    }
    
}
