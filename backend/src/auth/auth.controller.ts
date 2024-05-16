

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { RequireSignIn } from '../guards/RequireSignIn.guard';
import { IsUserGuard } from '../guards/IsUser.guard';
import { IsAdminGuard } from '../guards/IsAdmin.guard';
import { IsEmployeeGuard } from '../guards/IsEmployee.guard';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { LoginDto } from 'src/dto/Login.dto';
import { UpdateEmployeeDto } from 'src/dto/UpdateEmployee.dto';
import { UpdateAdminDto } from 'src/dto/UpdateAdmin.dto';
import { CreateEmployeeDto } from 'src/dto/CreateEmployee.dto';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/guards/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('Authorization')
@ApiTags("Auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary:"for registering user"
    })
    @ApiResponse({
        status:200,
        description:"User Registered Successfully"
    })
    @HttpCode(HttpStatus.OK)
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto)
    }

    @Post('login')
    @ApiOperation({
        summary:"for user signin"
    })
    @ApiResponse({
        status:200,
        description:"Loggedin Successfully"
    })
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }
    
    @Get('user-auth')
    @ApiOperation({
        summary:"validate user"
    })
    @ApiResponse({
        status:200,
        description:"ok:true"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.User)
    userAuth(@Res() res: any) {
        return this.authService.userAuth(res)
    }

    @Get('auth')
    @ApiOperation({
        summary:"validate signin"
    })
    @ApiResponse({
        status:200,
        description:"ok:true"
    })
    @UseGuards(RequireSignIn)
    auth(@Res() res: any) {
        return this.authService.auth(res)
    }

    @Get('admin-auth')
    @ApiOperation({
        summary:"validate admin"
    })
    @ApiResponse({
        status:200,
        description:"ok:true"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    adminAuth(@Res() res: any) {
        return this.authService.adminAuth(res)
    }

    @Get('employee-auth')
    @ApiOperation({
        summary:"validate employee"
    })
    @ApiResponse({
        status:200,
        description:"ok:true"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Employee)
    employeeAuth(@Res() res: any) {
        return this.authService.employeeAuth(res)
    }

    @Put('user')
    @ApiOperation({
        summary:"update user details"
    })
    @ApiResponse({
        status:200,
        description:"Profile Updated Sucessfully"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.User)
    updateUser(@Body() updateUserDto: UpdateUserDto) {
        return this.authService.updateUser(updateUserDto)
    }

    @Put('employee')
    @ApiOperation({
        summary:"update employee details"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Employee)
    updateEmployee(@Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.authService.updateEmployee(updateEmployeeDto)
    }

    @Put('admin-details')
    @ApiOperation({
        summary:"update admin details"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    updateAdmin(@Body() updateAdminDto: UpdateAdminDto) {
        return this.authService.updateAdmin(updateAdminDto)
    }

    @Get('load-user/:email')
    @ApiOperation({
        summary:"fetch user details"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    loadUser(@Param('email') email: string) {
        return this.authService.loadUser(email);
    }

    @Get('load-employee/:email')
    @ApiOperation({
        summary:"fetch employee details"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    loadEmployee(@Param('email') email: string) {
        return this.authService.loadEmployee(email);
    }

    @Put('user-update')
    @ApiOperation({
        summary:"update user details by admin"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    updateUserInAdmin(@Body() updateUserDto: UpdateUserDto) {
        return this.authService.updateUser(updateUserDto)
    }
    @Put('employee-update')
    @ApiOperation({
        summary:"update employee details by admin"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    updateEmployeeInAdmin(@Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.authService.updateEmployee(updateEmployeeDto)
    }
    @Delete('delete-user/:email')
    @ApiOperation({
        summary:"delete user by admin"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    deleteUser(@Param('email') email: string) {
        return this.authService.deleteUser(email)
    }

    @Delete('delete-employee/:email')
    @ApiOperation({
        summary:"delete employee by admin"
    })
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    deleteEmployee(@Param('email') email: string) {
        return this.authService.deleteEmployee(email)
    }

    @Post('create-employee')
    @ApiOperation({
        summary:"create employee by admin"
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(RequireSignIn, RolesGuard)
    @Roles(Role.Admin)
    createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.authService.createEmployee(createEmployeeDto)
    }
}
