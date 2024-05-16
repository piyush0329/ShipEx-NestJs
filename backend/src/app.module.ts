import { DeliveryModule } from './delivery/delivery.module'
import { OrderModule } from './orders/order.module'
import { ProductModule } from './products/product.module'
import { OfficeModule } from './office/office.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [
        DeliveryModule, 
        OrderModule, 
        ProductModule, 
        AuthModule, 
        OfficeModule, 
        MongooseModule.forRoot(process.env.MONGODB_URL)],
})
export class AppModule { }
