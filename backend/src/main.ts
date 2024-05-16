import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cors from 'cors'
import * as morgan from 'morgan'
import * as compression from 'compression'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.use(compression())
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:8080'
  }))
  app.use(morgan('dev'))
  
  

  const config = new DocumentBuilder()
    .setTitle('ShipEx')
    .setDescription('The ShipEx API description')
    .setVersion('1.0')
    .addTag('shipEx')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Authorization',
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)



  await app.listen(8000);
}
bootstrap();
