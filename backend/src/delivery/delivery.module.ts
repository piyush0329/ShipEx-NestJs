import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from 'src/schemas/vehicle.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { DeliveryMapping, DeliveryMappingSchema } from 'src/schemas/deliveryMapping.schema';
import { OrderLog, OrderLogSchema } from 'src/schemas/orderLog.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Order.name, schema: OrderSchema },   
                { name: DeliveryMapping.name, schema: DeliveryMappingSchema },   
                { name: OrderLog.name, schema: OrderLogSchema },  
                { name: Vehicle.name, schema: VehicleSchema },     
            ]
        ),
    ],
    controllers: [
        DeliveryController,],
    providers: [
        DeliveryService,],
})
export class DeliveryModule { }
