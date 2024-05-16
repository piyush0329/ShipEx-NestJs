

import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as JWT from 'jsonwebtoken'
import { Model } from 'mongoose';
import { CreateEmployeeDto } from 'src/dto/CreateEmployee.dto';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { LoginDto } from 'src/dto/Login.dto';
import { UpdateEmployeeDto } from 'src/dto/UpdateEmployee.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { comparePassword, hashPassword } from 'src/helpers/authHelper';
import { EmployeeDetails } from 'src/schemas/employeeDetails.schema';
import { User } from 'src/schemas/user.schema';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(EmployeeDetails.name) private employeeModel: Model<EmployeeDetails>
    ) { }

    async register(createUserDto: CreateUserDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: createUserDto.email });
            if (existingUser) {
                throw new ConflictException({
                    success: false,
                    message: "User Already registered",
                    // status: HttpStatus.OK
                })
            }
            const hashedPassword = await hashPassword(createUserDto.password)
            const user = new this.userModel({
                ...createUserDto,
                password: hashedPassword,
            });
            await user.save();
            return {
                success: true,
                message: "User registered successfully",
                status: HttpStatus.OK,
                user
            };
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                success: false,
                message: "Registration failed",
                // status: HttpStatus.INTERNAL_SERVER_ERROR,
            })
        }
    }
    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto
            if (!email || !password) {
                throw new UnauthorizedException({
                    // status: HttpStatus.OK,
                    success: false,
                    message: "Invalid Email or Password"
                })

            }
            const user = await this.userModel.findOne({ email }).populate('employeeDetails')
            if (!user) {
                throw new NotFoundException({
                    success: false,
                    message: "Email is not registered",
                })
            }
            const match = await comparePassword(password, user.password)
            if (!match) {
                throw new UnauthorizedException({
                    success: false,
                    message: "Invalid Password"
                })

            }
            let token = await JWT.sign({ _id: user._id, role: user.role }, "ASDFGHJUYTRDS", {
                expiresIn: '10d',
            })
            token = 'Bearer '+token
            if (user.employeeDetails !== null) {
                return {
                    status: HttpStatus.OK,
                    success: true,
                    message: "Loggedin Successfully",
                    user: {
                        _id: user._id,
                        name: user.name,
                        roll: user.roll,
                        classname: user.classname,
                        email: user.email,
                        role: user.role,
                        phone: user.phone,
                        gender: user.gender,
                        dob: user.dob,
                    },
                    employee: {
                        _id: user.employeeDetails._id,
                        aadharNumber: user.employeeDetails.aadharNumber,
                        dlNumber: user.employeeDetails.dlNumber,
                        address: user.employeeDetails.address
                    },
                    token
                }

            } else {
                return {
                    status: HttpStatus.OK,
                    success: true,
                    message: "Loggedin Successfully",
                    user: {
                        _id: user._id,
                        name: user.name,
                        roll: user.roll,
                        classname: user.classname,
                        email: user.email,
                        role: user.role,
                        phone: user.phone,
                        gender: user.gender,
                        dob: user.dob,
                    },
                    token
                }
            }

        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Login failed",
                status: HttpStatus.BAD_REQUEST,
            })

        }
    }
    userAuth(res: any) {
        res.status(200).send({
            ok: true
        })
    }
    auth(res: any) {
        res.status(200).send({ ok: true })
    }
    adminAuth(res: any) {
        res.status(200).send({
            ok: true
        })
    }
    employeeAuth(res: any) {
        res.status(200).send({ ok: true })
    }
    async updateUser(updateUserDto: UpdateUserDto) {
        try {
            const { name, roll, classname, email, password, phone, gender, dob } = updateUserDto

            const user = await this.userModel.findOne({ email: email, role: "user" })
            if (!user) {
                throw new BadRequestException({
                    success: false,
                    message: "Provided email is not belong to valid user",
                })
            }
            if (!password || password.length < 6) {
                return {
                    error: "Password is required and 6 character long"
                }
            }
            const hashedPassword = password ? await hashPassword(password) : undefined
            const updatedUser = await this.userModel.findOneAndUpdate({ email: email }, {
                name: name || user.name,
                roll: roll || user.roll,
                password: hashedPassword || user.password,
                classname: classname || user.classname,
                phone: phone || user.phone,
                gender: gender || user.gender,
                dob: dob || user.dob,
            }, { new: true })
            return {
                status: HttpStatus.OK,
                success: true,
                message: "Profile Updated Sucessfully",
                updatedUser
            }

        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Error while updating profile",
            })
        }
    }
    async updateEmployee(updateEmployeeDto: UpdateEmployeeDto) {
        try {
            const { name, roll, classname, email, password, dob, phone, gender, aadharNumber, dlNumber, address } = updateEmployeeDto
            const user = await this.userModel.findOne({ email: email, role: "employee" })
            if (!user) {
                throw new BadRequestException({
                    success: false,
                    message: "Provided email is not belong to valid employee",
                })

            }
            if (!password || password.length < 6) {
                return { error: "Password is required and 6 character long" }
            }
            const hashedPassword = password ? await hashPassword(password) : undefined
            const updatedUser = await this.userModel.findOneAndUpdate({ email: email }, {
                name: name || user.name,
                roll: roll || user.roll,
                password: hashedPassword || user.password,
                classname: classname || user.classname,
                phone: phone || user.phone,
                gender: gender || user.gender,
                dob: dob || user.dob,
            }, { new: true })
            const employee = await this.employeeModel.findById({ _id: user.employeeDetails })

            const updatedEmployee = await this.employeeModel.findByIdAndUpdate(employee._id, {
                aadharNumber: aadharNumber || employee.aadharNumber,
                dlNumber: dlNumber || employee.dlNumber,
                address: address || employee.address,
            }, { new: true })
            return {
                status: HttpStatus.OK,
                success: true,
                message: "Employee Profile Updated Sucessfully",
                updatedUser,
                updatedEmployee
            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Error while updating profile",
            })
        }
    }
    async updateAdmin(updateAdminDto: UpdateEmployeeDto) {
        try {
            const { name, roll, classname, email, password, phone, gender, dob, aadharNumber, dlNumber, address } = updateAdminDto
            const user = await this.userModel.findOne({ email: email, role: "admin" })
            if (!user) {
                throw new BadRequestException({
                    success: false,
                    message: "Provided email is not belong to valid admin",
                })
            }
            if (!password || password.length < 6) {
                return {
                    error: "Password is required and 6 character long"
                }
            }
            const hashedPassword = password ? await hashPassword(password) : undefined
            const updatedUser = await this.userModel.findOneAndUpdate({ email: email }, {
                name: name || user.name,
                roll: roll || user.roll,
                password: hashedPassword || user.password,
                classname: classname || user.classname,
                gender: gender || user.gender,
                phone: phone || user.phone,
                dob: dob || user.dob,
            }, { new: true })

            const employee = await this.employeeModel.findById({ _id: user.employeeDetails })
            const updatedEmployee = await this.employeeModel.findByIdAndUpdate(employee._id, {
                aadharNumber: aadharNumber || employee.aadharNumber,
                dlNumber: dlNumber || employee.dlNumber,
                address: address || employee.address,
            }, { new: true })
            return {
                status: HttpStatus.OK,
                success: true,
                message: "Profile Updated Sucessfully",
                updatedUser,
                updatedEmployee
            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Error while updating profile",
            })

        }
    }
    async loadUser(email: string) {
        try {
            const data = await this.userModel.findOne({ email: email, role: 'user' })
            if (data) {
                return {
                    status: HttpStatus.OK,
                    success: true,
                    message: "user data fetched sucessfully",
                    data
                }
            } else {
                throw new NotFoundException({
                    success: false,
                    message: "user does not exist with this email"
                })
            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Unable to load User data"
            })
        }
    }
    async loadEmployee(email: string) {
        try {
            const data = await this.userModel.findOne({ email: email, role: 'employee' })
            if (!data) {
                throw new NotFoundException({
                    success: false,
                    message: "user does not exist with this email"
                })
            } else {
                return {
                    status: HttpStatus.OK,
                    success: true,
                    message: "user data fetched sucessfully",
                    data
                }
            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Unable to load User data"
            })
        }
    }
    async deleteUser(email: string) {
        try {
            const user = await this.userModel.findOne({ email: email })
            if (user) {
                if (user.role === "user") {
                    const data = await this.userModel.findOneAndDelete({ email })
                    return {
                        status: HttpStatus.OK,
                        success: true,
                        message: "User deleted successfully",
                        data
                    }
                }
                else {
                    throw new NotFoundException({
                        // status: HttpStatus.OK,
                        success: false,
                        message: "user doesn't exist or email doesn't belong to valid user"
                    })

                }
            } else {
                throw new NotFoundException({
                    // status: HttpStatus.OK,
                    success: false,
                    message: "user doesn't exist or email doesn't belong to valid user"
                })

            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Error while deleting user",
            })
        }
    }
    async deleteEmployee(email: string) {
        try {
            const user = await this.userModel.findOne({ email: email })
            if (user) {
                if (user.role === "employee") {
                    const deletedEmployee = await this.employeeModel.findOneAndDelete({ _id: user.employeeDetails })
                    const data = await this.userModel.findOneAndDelete({ email })

                    return {
                        status: HttpStatus.OK,
                        success: true,
                        message: "Employee deleted successfully",
                        data
                    }
                }
                else {
                    throw new NotFoundException({
                        // status: HttpStatus.OK,
                        success: false,
                        message: "employee doesn't exist or email doesn't belong to valid employee"
                    })
                }
            } else {
                throw new NotFoundException({
                    // status: HttpStatus.OK,
                    success: false,
                    message: "employee doesn't exist or email doesn't belong to valid employee"
                })

            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException({
                success: false,
                message: "Error while deleting employee",
            })
        }
    }
    async createEmployee(createEmployeeDto: CreateEmployeeDto) {
        try {
            const { name, roll, classname, email, role, password, gender, phone, dob, aadharNumber, dlNumber, address } = createEmployeeDto

            const existingUser = await this.userModel.findOne({ email })
            if (existingUser) {
                throw new ConflictException({
                    // status: HttpStatus.OK,
                    success: false,
                    message: "Already registered"
                })
            }
            const hashedPassword = await hashPassword(password)
            const employee = await new this.employeeModel({ aadharNumber, dlNumber, address }).save()
            const user = await new this.userModel({ name, roll, classname, email, password: hashedPassword, role, gender, phone, dob, employeeDetails: employee._id }).save()
            return {
                status: HttpStatus.OK,
                success: true,
                message: "Employee Created Successfully",
                user,
                employee,
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                success: false,
                message: "Error in Creating Employee",
            })
        }
    }
}

