/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from 'src/dto/product.dto';
import { Office } from 'src/schemas/office.schema';
import { Order } from 'src/schemas/order.schema';
import { Product } from 'src/schemas/product.schema';
import { StripeService } from './stripe.service';
import { Payment } from 'src/schemas/payment.schema';
import { OrderLog } from 'src/schemas/orderLog.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Office.name) private officeModel: Model<Office>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
        @InjectModel(OrderLog.name) private orderLogModel: Model<OrderLog>,
        private stripeService: StripeService
    ) { }

    async addProduct(productDto: ProductDto) {
        try {
            const { startLocation, destinationLocation, weight, description, shipmentValue, userid } = productDto
            const startOffice = await this.officeModel.findOne({ _id: startLocation })
            const destinationOffice = await this.officeModel.findOne({ _id: destinationLocation })
            let lon1: number = Number(startOffice.longitude)
            let lat1: number = Number(startOffice.latitude)
            let lon2: number = Number(destinationOffice.longitude)
            let lat2: number = Number(destinationOffice.latitude)

            lon1 = lon1 * Math.PI / 180;
            lon2 = lon2 * Math.PI / 180;
            lat1 = lat1 * Math.PI / 180;
            lat2 = lat2 * Math.PI / 180;

            let dlon: number = lon2 - lon1;
            let dlat: number = lat2 - lat1;

            let a: number = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
            let c: number = 2 * Math.asin(Math.sqrt(a));

            let r: number = 6371;
            const distance: number = c * r;
            const price: number = Number(((distance * 1.5) + (Number(weight) * 5) + ((Number(shipmentValue) * 1) / 100)).toFixed(2))

            const existinguser = await this.productModel.findOne({ userid: userid })
            if (!existinguser) {
                const product = await new this.productModel({ startLocation, destinationLocation, weight, description, shipmentValue, price, userid }).save()
                const updatedProduct = await this.productModel.findById(product._id).populate('startLocation', ["officeName", "officeId"]).populate('destinationLocation', ["officeName", "officeId"])
                return {
                    success: true,
                    message: "Product Added Successfully",
                    updatedProduct,
                }
            } else {
                return {
                    success: false,
                    message: "Already Product Present",
                }
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "error in Adding Product",
            })
        }
    }
    async getUserProduct(userid: string) {
        try {
            const products = await this.productModel.find({ userid }).populate('startLocation', ["officeName", "officeId"]).populate('destinationLocation', ["officeName", "officeId"])

            if (products.length !== 0) {
                if (products[0].payment.sessionId !== null) {
                    const session = await this.stripeService.retrieveCheckoutSession(products[0].payment.sessionId);
                    if (session.status === 'complete') {
                        if (session.payment_status === "paid") {
                            const totalPrice = () => {
                                let total: number = 0;
                                products?.map((item) => (
                                    total = total + Number(item.price)
                                ))
                                return total
                            }
                            const updateprod = await this.productModel.findOneAndUpdate({ userid })
                            const order = await new this.orderModel({ startLocation: products[0].startLocation._id, destinationLocation: products[0].destinationLocation._id, products: products, payment: "Payment Done", buyer: userid, totalAmount: totalPrice() }).save()
                            const payment = await new this.paymentModel({ order: order._id, buyer: userid, sessionId: session.id, paymentStatus: "Payment Done" }).save()
                            const delproduct = await this.productModel.deleteMany({ userid: userid })
                            console.log(delproduct)
                            const prod = await this.productModel.find({ userid }).populate('startLocation', ["officeName", "officeId"]).populate('destinationLocation', ["officeName", "officeId"])

                            const orderLog = await new this.orderLogModel({ orderId: order._id, order_status: order.status, location: order.startLocation, user: order.buyer }).save()
                            return {
                                success: true,
                                message: "Order Done Successfully",
                                order,
                                // payment,
                                session,
                                products: prod
                            }
                        }
                    } else {
                        return {
                            success: true,
                            message: "Product fetched successfully",
                            products,
                            session
                        }
                    }
                }
                else {
                    return {
                        success: true,
                        message: "Product fetched successfully",
                        products,
                    }
                }
            }
            else {
                return {
                    success: true,
                    message: "no product available",
                    products
                }
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "error in getting Product",
            })
        }
    }
    async deleteSingleProduct(pid: string) {
        try {
            const product = await this.productModel.findByIdAndDelete(pid)
            if (!product) {
                return {
                    success: true,
                    message: "No such product to delete",
                }
            }
            return {
                success: true,
                message: "Product deleted successfully",
                product
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "error in Adding Product",
            })

        }

    }
    async deleteProducts(userid: string) {
        try {
            const products = await this.productModel.deleteMany({ userid: userid })
            return {
                success: true,
                message: "products deleted successfully",
                products
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "error in Adding Product"
            })
        }
    }
}    
