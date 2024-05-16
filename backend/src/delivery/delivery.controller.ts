/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/guards/role.enum';
import { CreateVehicleDto } from 'src/dto/CreateVehicle.dto';
import { OrderMappingDto } from 'src/dto/OrderMappping.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags("Delivery")
@ApiBearerAuth('Authorization')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) { }

    @Post('add-vehicle')
    @ApiOperation({
        summary:"creating vehicles"
    })
    @ApiResponse({
        status:200,
        description:"Vehicle Created Successfully" ,
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    addVehicle(@Body() createVehicleDto: CreateVehicleDto) {
        return this.deliveryService.addVehicle(createVehicleDto)
    }

    @Get('get-free-vehicle')
    @ApiOperation({
        summary:"getting vehicle with status free"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getFreeVehicle() {
        return this.deliveryService.getFreeVehicle()
    }

    @Get('get-all-vehicle')
    @ApiOperation({
        summary:"get all vehicles"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getAllVehicle() {
        return this.deliveryService.getAllVehicle()
    }

    @Put('update-vehicle')
    @ApiOperation({
        summary:"update vehicle details"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    updateVehicle(@Body() createVehicleDto: CreateVehicleDto) {
        return this.deliveryService.updateVehicle(createVehicleDto)
    }

    @Get('get-working-vehicle')
    @ApiOperation({
        summary:"get vehicle whose status  is working"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getWorkingVehicle() {
        return this.deliveryService.getWorkingVehicle()
    }

    @Get('get-vehicle/:vehicleId')
    @ApiOperation({
        summary:"get vehicle based on vehicle id"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getVehicle(@Param('vehicleId') vehicleId: string) {
        return this.deliveryService.getVehicle(vehicleId)
    }

    @Post('map-orders')
    @ApiOperation({
        summary:"map orders with particular vehicles"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    mapOrders(@Body() orderMappingDto: OrderMappingDto) {
        return this.deliveryService.mapOrders(orderMappingDto)
    }

    @Get('get-vehicle-orders/:vehicleId')
    @ApiOperation({
        summary:"get orders of a particular vehicle"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    getVehicleOrder(@Param('vehicleId') vehicleId: string) {
        return this.deliveryService.getVehicleOrder(vehicleId)
    }
}
