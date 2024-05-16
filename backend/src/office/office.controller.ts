/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from 'src/dto/CreateOffice.dto';
import { RequireSignIn } from 'src/guards/RequireSignIn.guard';
import { Role } from 'src/guards/role.enum';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/role.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('Authorization')
@ApiTags("Office")
export class OfficeController {
    constructor(private officeService: OfficeService) { }

    @Post('create-office')
    @ApiOperation({
        summary:"create office by admin"
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(RequireSignIn ,RolesGuard)
    @Roles(Role.Admin)
    createOffice(@Body() createOfficeDto: CreateOfficeDto) {
        return this.officeService.createOffice(createOfficeDto)
    }

    @Get('get-office')
    @ApiOperation({
        summary:"get office"
    })
    @UseGuards(RequireSignIn)
    getOffices() {
        return this.officeService.getOffices()
    }
}
