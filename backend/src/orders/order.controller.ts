/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';
import { AddOrderDto } from 'src/dto/addOrder.dto';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/guards/role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { OrderStatusDto } from 'src/dto/orderStatus.dto';
import { CreateCheckOutDto } from 'src/dto/CreateCheckout.dto';
import { CreateRefundDto } from 'src/dto/createRefund.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('Authorization')
@ApiTags("Orders")
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post('add-orders')
    @ApiOperation({
        summary:"add order"
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(RequireSignIn)
    addOrders(@Body() addOrderDto: AddOrderDto) {
        return this.orderService.addOrders(addOrderDto)
    }
    @Get('get-orders/:buyerid')
    @ApiOperation({
        summary:"get orders of particular user"
    })
    @UseGuards(RequireSignIn)
    getOrders(@Param('buyerid') buyerid: string) {
        return this.orderService.getOrders(buyerid)
    }

    @Get('all-orders')
    @ApiOperation({
        summary:"get all orders for admin"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getAllOrders(@Query() query: any) {
        return this.orderService.getAllOrders(query)
    }

    @Get('employee-all-orders')
    @ApiOperation({
        summary:"get orders with status shipped,delivered,outfordelivery for employee "
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Employee)
    getEmployeeAllOrders(@Query() query: any) {
        return this.orderService.getEmployeeAllOrders(query)
    }

    @Put('order-status/:orderId')
    @ApiOperation({
        summary:"update order status by admin"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    orderStatus(@Param('orderId') orderId: any, @Body() orderStatusDto: OrderStatusDto) {
        return this.orderService.orderStatus(orderId, orderStatusDto)
    }
    @Put('employee-order-status/:orderId')
    @ApiOperation({
        summary:"update order status by employee"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Employee)
    employeeOrderStatus(@Param('orderId') orderId: any, @Body() orderStatusDto: OrderStatusDto) {
        return this.orderService.employeeOrderStatus(orderId, orderStatusDto)
    }
    @Get('get-order')
    @ApiOperation({
        summary:"get orders based on filter"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getFilteredOrders(@Query() query: any) {
        return this.orderService.getFilteredOrders(query)
    }
    @Get('get-excelworksheet')
    @ApiOperation({
        summary:"get excel worksheet of orders"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getExcelWorksheet(@Query() query: any) {
        return this.orderService.getExcelWorksheet(query)
    }

    @Post('invoice-generate')
    @ApiOperation({
        summary:"generate invoice of delivered orders"
    })
    @UseGuards(RequireSignIn)
    generateInvoice(@Body() o: any) {
        return this.orderService.generateInvoice(o)
    }

    @Post('create-checkout-session')
    @ApiOperation({
        summary:"to create checkout session for making payment"
    })
    @UseGuards(RequireSignIn)
    @HttpCode(HttpStatus.OK)
    createCheckout(@Body() createCheckOutDto: CreateCheckOutDto, @Res()res:any) {
        return this.orderService.createCheckout(createCheckOutDto,res)
    }

    @Post('refund')
    @ApiOperation({
        summary:"to create refund of cancelled orders"
    })
    @UseGuards(RequireSignIn)
    @HttpCode(HttpStatus.OK)
    createRefund( @Res()res:any , @Req() req:any) {
        return this.orderService.createRefund(req,res)
    }

    @Get('order-statistics')
    @ApiOperation({
        summary:"to get the order stats"
    })
    @UseGuards(RequireSignIn,RolesGuard)
    @Roles(Role.Admin)
    getOrderStaticstics( ) {
        return this.orderService.getOrderStaticstics()
    }

    @Get('delivery-orders')
    @ApiOperation({
        summary:"get orders with payment status done and shipping status not process"
    })
    @UseGuards(RequireSignIn,RolesGuard)
    @Roles(Role.Admin)
    getDeliveryOrders( @Res()res:any ) {
        return this.orderService.getDeliveryOrders(res)
    }


}
