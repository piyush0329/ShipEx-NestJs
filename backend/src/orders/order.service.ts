/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as ExcelJs from 'exceljs'
import * as nodemailer from 'nodemailer'
import * as pdf from 'html-pdf'
import * as ejs from 'ejs'
import { OrderStatusDto } from 'src/dto/orderStatus.dto';
import { StripeService } from 'src/products/stripe.service';
import { DeliveryMapping } from 'src/schemas/deliveryMapping.schema';
import { Office } from 'src/schemas/office.schema';
import { Order } from 'src/schemas/order.schema';
import { OrderLog } from 'src/schemas/orderLog.schema';
import { Payment } from 'src/schemas/payment.schema';
import { User } from 'src/schemas/user.schema';
import * as moment from 'moment';
import { CreateCheckOutDto } from 'src/dto/CreateCheckout.dto';
import { Product } from 'src/schemas/product.schema';
import { CreateRefundDto } from 'src/dto/createRefund.dto';



@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(OrderLog.name) private orderLogModel: Model<OrderLog>,
        @InjectModel(DeliveryMapping.name) private deliveryMappingModel: Model<DeliveryMapping>,
        @InjectModel(Office.name) private officeModel: Model<Office>,
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Product.name) private productModel: Model<Product>,

        private stripeService: StripeService

    ) { }

    async addOrders(addOrderDto: any) {
        try {
            const { products, buyer, payment } = addOrderDto

            if (!products) {
                return { message: "Products are required" }
            }
            if (!buyer) {
                return { message: "Buyer is required" }
            }
            console.log(buyer)
            const totalPrice = () => {
                let total = 0;
                products?.map((item: any) => (
                    total = total + item.price
                ))
                return total
            }
            const order = await new this.orderModel({ products: products, payment: payment, buyer: buyer, totalAmount: totalPrice() }).save()
            return {
                success: true,
                message: "Order Added Successfully",
                order
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "Error in Adding Product",
            })
        }
    }

    async getOrders(buyerid: string) {
        try {
            const orders = await this.orderModel
                .find({ buyer: buyerid })
                .populate('startLocation', ['officeName'])
                .populate('destinationLocation', ['officeName'])
                .populate('buyer', ['name'])
                .populate({
                    path: 'timeLine.location',
                    model: Office.name,
                })
                .sort({ createdAt: -1 })
            for (const order of orders) {
                if (order.refundDetails !== null) {
                    const refund = await this.stripeService.retrieveRefund(order.refundDetails.refundId);
                    if (refund.destination_details.card.reference != 'pending') {
                        await this.orderModel.findOneAndUpdate(
                            { _id: order._id },
                            {
                                refundDetails: {
                                    destination_details: {
                                        card: {
                                            reference: refund.destination_details.card.reference,
                                            reference_status: refund.destination_details.card.reference_status,
                                            reference_type: refund.destination_details.card.reference_type,
                                            type: refund.destination_details.card.type,
                                        },
                                        type: 'card',
                                    },
                                    refundId: refund.id,
                                },
                            },
                        );
                    }
                }

                const logs = await this.orderLogModel.find({ orderId: order._id }).sort({ createdAt: -1 });
                const expectedDel = await this.deliveryMappingModel.findOne({ orders: order._id });

                await this.orderModel.findOneAndUpdate(
                    { _id: order._id },
                    {
                        timeLine: logs,
                        expectedDelivery: expectedDel?.arrival_time,
                    },
                );
            }

            const updatedOrders = await this.orderModel
                .find({ buyer: buyerid })
                .populate('startLocation', ['officeName'])
                .populate('destinationLocation', ['officeName'])
                .populate('buyer', 'name')
                .populate({
                    path: 'timeLine.location',
                    model: Office.name,
                })
                .sort({ createdAt: -1 });

            return {
                success: true,
                message: 'Order Fetched Successfully',
                updatedOrders,
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: 'Error while getting order',
            })
        }


    }

    async getAllOrders(query: any) {
        try {
            const { page, limit } = query
            console.log(page, limit)
            const orders = await this.orderModel.find({}).skip((page - 1) * limit).limit(limit).populate('startLocation', ['officeName']).populate('destinationLocation', ['officeName']).populate("buyer", "name").sort({ createdAt: -1 })
            const orderlength = (await this.orderModel.find({}).populate("buyer", "name").sort({ createdAt: -1 })).length
            orders.forEach(async (order) => {
                if (order.refundDetails !== null) {
                    const refund = await this.stripeService.retrieveRefund(order.refundDetails.refundId)
                    if (refund.destination_details.card.reference != "pending") {
                        const updateorder = await this.orderModel.findOneAndUpdate({ _id: order._id }, {
                            status: 'Cancelled',
                            refundDetails: {
                                destination_details: {
                                    card: {
                                        reference: refund.destination_details.card.reference,
                                        reference_status: refund.destination_details.card.reference_status,
                                        reference_type: refund.destination_details.card.reference_type,
                                        type: refund.destination_details.card.type
                                    },
                                    type: "card"
                                },
                                refundId: refund.id,
                            }
                        })
                    }
                }
            })
            return {
                success: true,
                orders,
                orderlength
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "Error while getting orders"
            })
        }
    }

    async getEmployeeAllOrders(query: any) {
        try {
            const { page, limit } = query
            const orders = await this.orderModel.find({ $or: [{ status: "Shipped" }, { status: "Out for delivery" }, { status: "Delivered" }] }).skip((page - 1) * limit).limit(limit).populate('startLocation', ['officeName']).populate('destinationLocation', ['officeName']).populate("buyer", "name").sort({ createdAt: -1 })
            const orderlength = (await this.orderModel.find({ $or: [{ status: "Shipped" }, { status: "Out for delivery" }, { status: "Delivered" }] }).populate("buyer", "name").sort({ createdAt: -1 })).length
            return {
                success: true,
                orders,
                orderlength
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: true,
                message: "error while getting order"
            })
        }
    }

    async orderStatus(orderId: any, orderStatusDto: OrderStatusDto) {
        try {
            const { status, userId } = orderStatusDto
            const order = await this.orderModel.findOne({ _id: orderId })
            if (status === 'Cancelled') {
                if (order.payment === "Payment Done") {
                    const payment = await this.paymentModel.findOne({ order: order._id })
                    const session = await this.stripeService.retrieveCheckoutSession(payment.sessionId)
                    const payment_intent = session.payment_intent
                    const refund = await this.stripeService.createRefund(
                        payment_intent, Math.floor(order.totalAmount * 100),
                    );
                    const updatePayment = await this.paymentModel.findOneAndUpdate({ order: order._id }, {
                        refundId: refund.id,
                        paymentStatus: "Refunded"
                    })
                    const refundDetails = await this.stripeService.retrieveRefund(refund.id)
                    order.payment = "Refunded"
                    order.refundDetails = {
                        destination_details: refundDetails.destination_details,
                        refundId: refund.id
                    }
                    await order.save()
                }
            }
            const orderLog = await new this.orderLogModel({ orderId: order._id, order_status: status, user: userId }).save()
            order.status = status
            await order.save()
            return {
                order
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "Error while updating order"
            })
        }
    }

    async employeeOrderStatus(orderId: any, orderStatusDto: OrderStatusDto) {
        try {
            const { status, userId } = orderStatusDto

            if (status === "Out for delivery" || status === "Delivered") {
                const order = await this.orderModel.findOne({ _id: orderId })
                const orderLog = await new this.orderLogModel({ orderId: orderId, order_status: status, user: userId, location: order.destinationLocation }).save()
                order.status = status
                await order.save()
                return {
                    order
                }
            } else {
                return {
                    success: false,
                    message: "Please Provide Valid Status",
                }
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "Error while updating order"
            })
        }
    }

    async getFilteredOrders(query: any) {

        try {
            const { page, limit, status, payment, source, destination } = query
            const filters: Record<string, string | undefined> = {};
            if (status) filters.status = status
            if (payment) filters.payment = payment
            if (source) filters.startLocation = source
            if (destination) filters.destinationLocation = destination
            console.log(filters)
            const orderlength = (await this.orderModel.find(filters).populate("buyer", "name").sort({ createdAt: -1 })).length
            const orders = (await this.orderModel.find(filters).skip((page - 1) * limit).limit(limit).populate('startLocation', ['officeName']).populate('destinationLocation', ['officeName']).populate("buyer", "name").sort({ createdAt: -1 }))

            return {
                success: true,
                orderlength,
                orders
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "Error while getting order"
            })

        }


    }

    async getExcelWorksheet(query: any) {
        try {
            const { status, payment, source, destination } = query
            const filters: Record<string, string | undefined> = {};
            if (status) filters.status = status
            if (payment) filters.payment = payment
            if (source) filters["products.startLocation.officeName"] = source
            if (destination) filters["products.destinationLocation.officeName"] = destination
            const orders = (await this.orderModel.find(filters).populate("buyer", "name").sort({ createdAt: -1 }))

            const workbook = new ExcelJs.Workbook()
            const worksheet = workbook.addWorksheet('orders')
            worksheet.columns = [
                { header: 'S.no', key: 's_no', width: 5 },
                { header: 'Buyer Name', key: 'buyer_name', width: 20 },
                { header: 'Status', key: 'status', width: 10 },
                { header: 'Payment', key: 'payment', width: 15 },
                { header: 'Total Amount', key: 'totalAmount', width: 15 },
            ]
            let count = 1
            orders.forEach((order: any) => {
                order.s_no = count
                order.buyer_name = order?.buyer.name
                worksheet.addRow(order)
                count += 1
            })
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true }
            })
            const data = await workbook.xlsx.writeFile('order.xlsx')

            return {
                success: true,
                data
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: true,
                message: "Error while getting Excel"
            })
        }
    }

    async generateInvoice(o:any){
        try {
            const buyer = await this.userModel.findOne({ _id: o.buyer })
    
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS
                }
            });
            const invoiceData = {
                invoiceNumber: `${o._id}${moment().format('DDMMYYYY')}`,
                products: o.products,
                order: o,
                buyer: buyer
            }
            const template = await ejs.renderFile('invoice.ejs', { ...invoiceData, moment })
            const attachment = await ejs.renderFile('attachment.ejs', { ...invoiceData, moment })
            const pdfOptions = { format: 'Letter' }
            pdf.create(attachment, pdfOptions).toFile('invoice.pdf', (err, result) => {
                if (err) {
                    console.error('Error creating PDF:', err)
                    throw new InternalServerErrorException({
                        success:false,
                        message:"Error in Creating PDF"
                    })
                    
                } else {
                    console.log('PDF created successfully:', result)
                }
            });
    
            var mailOptions = {
                from: process.env.FROM_EMAIL,
                to: process.env.TO_EMAIL,
                subject: 'Invoice of your product',
                html: template,
                attachments: [{'filename': 'invoice.pdf',
                path: 'C:\\Users\\HSTPL_LAP_008\\Documents\\Learnings\\ShipEx\\invoice.pdf',
                contentType: 'application/pdf'}]
            };
            transporter.sendMail(mailOptions, function (error:any, info:any) {
                if (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Error in sending mail',
                        error
                    }
                } else {
                    const response = info.response
                    console.log('Email sent: ' + info.response);
                    return {
                        success: true,
                        message: 'Email Sent Successfully',
                        response
                    }
                }
            });
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"error while getting invoice"
            })
            
        }
    }

    async createCheckout(createCheckOutDto:CreateCheckOutDto , res:any) {
        try {
            // let sessionId
            const { products, userId } = createCheckOutDto
            const user = await this.userModel.findOne({ _id: userId })
            const lineItems = products.map((product:any) => (
                {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: product.description,
                        },
                        unit_amount: Math.ceil(product.price * 100),
                    },
                    quantity: 1
                }
            ))
            const checkoutDetails ={
                payment_method_types: ["card"],
                line_items: lineItems,
                phone_number_collection: {
                    enabled: true
                },
                metadata: {
                    userId: userId,
                },
                mode: 'payment',
                success_url: `http://localhost:3000/cart?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:3000/cart?session_id={CHECKOUT_SESSION_ID}`,
            }
            const session = await this.stripeService.createCheckoutSession(checkoutDetails)
            products.forEach(async (element:any) => {
                if (element.payment.sessionId !== null) {
                   
                    const session = await this.stripeService.retrieveCheckoutSession(element.payment.sessionId)
                    if (session.status === "open") {
                        const sessionId = element.payment.sessionId
                        const checkout_url = `https://checkout.stripe.com/c/pay/${sessionId}#fidkdWxOYHwnPyd1blpxYHZxWjA0Sl9WRGdWRzVyckRSTV9tbk5PMWpWTVdgTnRodkBSVkJxPV9HfWRcd3VzTGRibk98X2pnSzRgSGpOR2hkTTRBfTFddUJLbU5QdXBvMkFTYENxVm01THV%2FNTVfd2puQG5wTScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl`
                        console.log(checkout_url)
                        return res.send({
                            success: true,
                            message: "url and session id",
                            url: checkout_url,
                            sessId: sessionId
                        })
                    }
                } else {
                    const product = await this.productModel.findOneAndUpdate({ userid: userId }, {
                        payment: {
                            sessionId: session.id,
                        }
                    }, { new: true })  
                    return res.send({
                        success: true,
                        message: "url and session id",
                        url: session.url,
                        sessionId: session.id,
                        product
                    })
                }
            });
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"Error in checkout Controller"
            })
            
        }
    }

    async createRefund(req:any,res:any){
        try {
            const { order, userId } = req.body
            const payment = await this.paymentModel.findOne({ order: order._id })
            console.log(payment)
            const session = await this.stripeService.retrieveCheckoutSession(payment.sessionId)
            const refund = await this.stripeService.createRefund( session.payment_intent,  Math.floor((order.totalAmount * 100)),
            );
            const updatePayment = await this.paymentModel.findOneAndUpdate({ order: order._id }, {
                refundId: refund.id,
                paymentStatus: "Refunded"
            })
            const refundDetails = await this.stripeService.retrieveRefund(refund.id)
            const updateOrder = await this.orderModel.findOneAndUpdate({ _id: order._id }, {
                status: 'Cancelled',
                expectedDelivery: null,
                payment: "Refunded",
                refundDetails: {
                    destination_details: refundDetails.destination_details,
                    refundId: refund.id
                }
            })
            const orderLog = await new this.orderLogModel({ orderId: order._id, order_status: 'Cancelled', user: userId }).save()
            return res.send({
                success: true,
                message: "Refund initiated sucessfully",
                refundId: refund.id
            })
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"error while creating refund"
            })
            
        }
    }

    async getOrderStaticstics(){
        try {
            const orderStats = await this.orderModel.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" }
                        },
                        totalOrders: { $sum: 1 },
                        totalAmount: { $sum: "$totalAmount" }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.payment": 1 }
                }
            ])
            const orderPaymentBased = await this.orderModel.aggregate([
                {
                    $group: {
                        _id: "$payment",
                        count: { $sum: 1 }
                    }
                }
            ])
            const orderStatusBased = await this.orderModel.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])
            return {
                success: true,
                message: 'OrderStats Fetch Successfully',
                orderStats,
                orderPaymentBased,
                orderStatusBased
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:'error while getting order stats'
            })
            
    
        }
    }

    async getDeliveryOrders(res: any){
        try {
            const orders = await this.orderModel.find({ payment: 'Payment Done', status: "Not Process" }).populate('startLocation', ['officeName']).populate('destinationLocation', ['officeName']).populate("buyer", "name").sort({ createdAt: -1 })
            res.json(orders)
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success:false,
                message:"error while getting orders"
            })
            
        }
    }



}


