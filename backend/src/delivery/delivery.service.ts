/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from 'src/dto/CreateVehicle.dto';
import { OrderMappingDto } from 'src/dto/OrderMappping.dto';
import { DeliveryMapping } from 'src/schemas/deliveryMapping.schema';
import { Order } from 'src/schemas/order.schema';
import { OrderLog } from 'src/schemas/orderLog.schema';
import { Vehicle } from 'src/schemas/vehicle.schema';

@Injectable()
export class DeliveryService {

    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(OrderLog.name) private orderLogModel: Model<OrderLog>,
        @InjectModel(DeliveryMapping.name) private deliveryMappingModel: Model<DeliveryMapping>,
        @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,

    ) { }

    async addVehicle(createVehicleDto: CreateVehicleDto) {
        try {
            const { vehicleNo, model_name, capacity, driver } = createVehicleDto

            const existingVehicle = await this.vehicleModel.findOne({ vehicleNo })
            if (existingVehicle) {
                return {
                    success: false,
                    message: "Vehicle Already Registered"
                }
            }
            const vehicle = await new this.vehicleModel({ vehicleNo: vehicleNo, model_name: model_name, capacity: capacity, driver: driver }).save()
            return {
                success: true,
                message: "Vehicle Created Successfully",
                vehicle
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: "Error in creating vehicle"
            })
        }

    }
    async getFreeVehicle() {
        try {
            const vehicles = await this.vehicleModel.find({ status: "Free" });

            // const deliveryMapping = await deliveryMappingModel.find()
            // const deliveryMappingIds = deliveryMapping.map(mapping => mapping.vehicleId.toString());
            // const filteredVehicles = vehicles.filter(vehicle => !deliveryMappingIds.includes(vehicle._id.toString()));
            return {
                success: true,
                message: "Vehicles Fetched Successfully",
                vehicles
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: "Error in getting orders"
            })

        }
    }

    async getAllVehicle() {
        try {
            const vehicles = await this.vehicleModel.find({})
            return {
                success: true,
                message: "Vehicles fetched Successfully",
                vehicles
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: "Error in getting vehicles"
            })
        }
    }

    async updateVehicle(createVehicleDto:CreateVehicleDto) {
        try {
            const { vehicleNo, capacity, driver, model_name } = createVehicleDto
            if (!vehicleNo) {
                throw new BadRequestException({
                    success: false,
                    message: "vehicle number is not available"
                })
            }
            const vehicle = await this.vehicleModel.findOne({ vehicleNo: vehicleNo })
            if (vehicle.status !== "Working") {
                const updatedVehicle = await this.vehicleModel.findOneAndUpdate({ vehicleNo: vehicleNo }, {
                    vehicleNo: vehicleNo || vehicle.vehicleNo,
                    capacity: capacity || vehicle.capacity,
                    model_name: model_name || vehicle.model_name,
                    driver: driver || vehicle.driver,
                    status: vehicle.status
                }, { new: true })
                return {
                    success: true,
                    message: "Vehicles Updated Successfully",
                    updatedVehicle
                }
            } else {
                return {
                    success: false,
                    message: "Vehicle is in working stage can't update right now"
                }
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"error in getting vehicle"
            })
        }
    }

    async getWorkingVehicle(){
        try {
            const vehicles = await this.vehicleModel.find({ status: "Working" });
            return {
                success: true,
                message: "Vehicles Fetched Successfully",
                vehicles: vehicles
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                succes:false,
                message:"error in getting vehicle"
            })
        }
    }

    async getVehicle(vehicleId:string){
        try {
            const vehicle = await this.vehicleModel.findOne({ _id: vehicleId })
            return {
                success: true,
                message: "Vehicle Fetched Successfully",
                vehicle
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"Error in getting vehicle"
            })
            
        }
    }

    async mapOrders(orderMappingDto:OrderMappingDto){
        const { vehicleId, orders, userid } =orderMappingDto
        try {
            if (!vehicleId) {
                return {
                    success: false,
                    message: "Vehicle Id is Required"
                }
            }
            if (orders.length <= 0) {
                return {
                    success: false,
                    message: "Orders are required"
                }
            }
            const order_details = await this.orderModel.findOne({ _id: orders[0] }).populate('startLocation', ['longitude', 'latitude']).populate('destinationLocation', ['longitude', 'latitude'])
            let lon1 = order_details.startLocation.longitude
            let lat1 = order_details.startLocation.latitude
            let lon2 = order_details.destinationLocation.longitude
            let lat2 = order_details.destinationLocation.latitude
    
            lon1 = lon1 * Math.PI / 180;
            lon2 = lon2 * Math.PI / 180;
            lat1 = lat1 * Math.PI / 180;
            lat2 = lat2 * Math.PI / 180;
            let dlon = lon2 - lon1;
            let dlat = lat2 - lat1;
            let a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.pow(Math.sin(dlon / 2), 2);
            let c = 2 * Math.asin(Math.sqrt(a));
            let r = 6371;
            const distance = c * r
            const speed = 20
            const time = distance / speed
            const packingTime = 24
            const deliveryTime = 24
            const date = new Date()
            const updatedDate = new Date(date.getTime() + (time + packingTime + deliveryTime) * 3600 * 1000)
    
            orders.forEach(async (order) => {
                const order_details = await this.orderModel.findOne({ _id: order })
                const updateStatus = await this.orderModel.findOneAndUpdate({ _id: order }, { status: "Shipped" })
                const orderLog = await new this.orderLogModel({ orderId: order, order_status: "Shipped", user: userid, location: order_details.startLocation }).save()
    
            })
            const mappedOrders = await new this.deliveryMappingModel({ vehicleId, orders, arrival_time: updatedDate, departure_time: date }).save()
            const vehicle = await this.vehicleModel.findOneAndUpdate({ _id: vehicleId }, { status: "Working" }, { new: true })
            return {
                success: true,
                message: "Orders Mapped Successfully",
                vehicle
                //mappedOrders
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"Error in mapping orders"
            })
        }
    }

    async getVehicleOrder(vehicleId:string){

        try {
            const vehicleOrder = await this.deliveryMappingModel.findOne({ vehicleId: vehicleId })
            let order_details = []
            if (vehicleOrder) {
                for (let i = 0; i < vehicleOrder.orders.length; i++) {
                    const fetchedOrder = await this.orderModel.findById(vehicleOrder.orders[i]).populate('startLocation', ['officeName']).populate('destinationLocation', ['officeName'])
                    order_details.push(fetchedOrder)
                }
            }
             return {
                success: true,
                message: "Orders Fetched Successfully",
                order_details
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success:false,
                message:"Error in getting Vehicle Orders"
            })
            
        }

    }



}
