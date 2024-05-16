import { ApiProperty } from "@nestjs/swagger"
import {  IsEmail } from "class-validator"


export class LoginDto{
    
    @ApiProperty({
        example: 'amit@gmail.com',
        description: "provide the email",
        type:'string'
    })
    @IsEmail()
    email:string

    @ApiProperty({
        example: '123456',
        description: "provide the passwrod",
        type:'string'
    })
    password:string

  
}