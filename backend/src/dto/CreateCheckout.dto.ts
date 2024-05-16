import { ApiProperty } from "@nestjs/swagger"


export class CreateCheckOutDto {

    @ApiProperty({
        example:"Products",
        description:"it contains the arry of products",
        type:'any'
    })
    products: any[]

    @ApiProperty({
        example:'65cd8eabd64714bc4b07f32b',
        description:"this contains the object id of user"
    })
    userId: string

}