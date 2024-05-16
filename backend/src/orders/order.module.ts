import { OrderService } from './order.service';
import { OrderController } from './order.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { StripeService } from 'src/products/stripe.service';
import { OrderLog, OrderLogSchema } from 'src/schemas/orderLog.schema';
import { DeliveryMapping, DeliveryMappingSchema } from 'src/schemas/deliveryMapping.schema';
import { Office, OfficeSchema } from 'src/schemas/office.schema';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { User, UserSchema } from 'src/schemas/user.schema';


@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Order.name, schema: OrderSchema },   
                { name: DeliveryMapping.name, schema: DeliveryMappingSchema },   
                { name: OrderLog.name, schema: OrderLogSchema },   
                { name: Office.name, schema: OfficeSchema },   
                { name: Payment.name, schema: PaymentSchema },   
                { name: Product.name, schema: ProductSchema },   
                { name: User.name, schema: UserSchema },   
            ]
        ),
    ],
    controllers: [ OrderController,],
    providers: [OrderService,StripeService],
})
export class OrderModule { }
