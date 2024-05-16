import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"


export class OrderMappingDto {

    @ApiProperty({
        example: 'UK09GF3453',
        description: "provide the vehicle number",
        type:'string'
    })
    vehicleId: string

    @ApiProperty({
        example: '[65d5d73eebf12241b489a609,65d5d73eebf12241b489a609]',
        description: "array of object id of orders",
        type:'any'
    })
    orders: any[]


    @ApiProperty({
        example: '65d5d73eebf12241b489a609',
        description: "object id of user",
        type:'string'
    })
    userid: string

}