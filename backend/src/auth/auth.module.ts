

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { EmployeeDetails, EmployeeDetailsSchema } from 'src/schemas/employeeDetails.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: User.name, schema: UserSchema },
                { name: EmployeeDetails.name, schema: EmployeeDetailsSchema }
            ]
        ),

    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
