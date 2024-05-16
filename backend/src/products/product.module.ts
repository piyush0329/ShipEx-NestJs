import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Office, OfficeSchema } from 'src/schemas/office.schema';
import { StripeService } from './stripe.service';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { OrderLog, OrderLogSchema } from 'src/schemas/orderLog.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Product.name, schema: ProductSchema },   
                { name: Office.name, schema: OfficeSchema },   
                { name: Order.name, schema: OrderSchema },   
                { name: Payment.name, schema: PaymentSchema },   
                { name: OrderLog.name, schema: OrderLogSchema },   
            ]
        ),
    ],
    controllers: [ProductController,],
    providers: [ProductService,StripeService],
})
export class ProductModule { }
