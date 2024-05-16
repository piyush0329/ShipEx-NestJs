/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';
import { ProductDto } from 'src/dto/product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller()
@ApiBearerAuth('Authorization')
@ApiTags("Product")
export class ProductController {
    constructor(private productService:ProductService){}

    @Post('add-product')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RequireSignIn)
    addProduct(@Body() productDto:ProductDto){
        return this.productService.addProduct(productDto)
    }
    @Get('get-products/:userid')
    @UseGuards(RequireSignIn)
    getsUserProduct(@Param('userid') userid: string){
        return this.productService.getUserProduct(userid)

    }
    @Delete('delete-single-product/:pid')
    @UseGuards(RequireSignIn)
    deleteSingleProduct(@Param('pid') pid:string){
        return this.productService.deleteSingleProduct(pid)
    }

    @Delete('delete-products/:userid')
    @UseGuards(RequireSignIn)
    deleteProducts(@Param('userid') userid:string){
        return this.productService.deleteProducts(userid)
    }

}
