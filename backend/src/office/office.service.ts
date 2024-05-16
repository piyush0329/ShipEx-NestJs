/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOfficeDto } from 'src/dto/CreateOffice.dto';
import { Office } from 'src/schemas/office.schema';

@Injectable()
export class OfficeService {
    constructor(
        @InjectModel(Office.name) private officeModel: Model<Office>
    ) { }

    async createOffice(createOfficeDto: CreateOfficeDto) {
        try {
            const { officeId, officeName, state, city, locality, longitude, latitude, pincode, country } = createOfficeDto
            const existingOffice = await this.officeModel.findOne({ officeId: officeId })
            if (existingOffice) {
                return {
                    status: HttpStatus.OK,
                    success: false,
                    message: "Office id already exist"
                }
            }
            const office = await new this.officeModel({ officeId, officeName, state, city, locality, longitude, latitude, pincode, country }).save()
            return {
                status: HttpStatus.OK,
                success: true,
                message: "Office Created Successfully",
                office
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "Error in Creating Office",
            })
        }

    }
    async getOffices() {
        try {
            const offices = await this.officeModel.find({})
            if (offices) {
                return {
                    success: true,
                    message: "offices fetched sucessfully",
                    offices,
                }
            } else {
                return {
                    success: false,
                    message: "error while getting offices"
                }
            }
        }
        catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Unable to load Employee data"
            })
        }

    }
}
