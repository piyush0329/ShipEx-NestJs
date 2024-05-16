import { MongooseModule } from '@nestjs/mongoose';
import { OfficeService } from './office.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { Office, OfficeSchema } from 'src/schemas/office.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Office.name, schema: OfficeSchema },   
            ]
        ),
    ],
    controllers: [OfficeController],
    providers: [OfficeService,],
})
export class OfficeModule { }
