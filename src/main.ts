
import * as env from "dotenv";
env.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppLoggerService } from './logger/applogger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(AppLoggerService));
  //Swagger
  const options = new DocumentBuilder()
    .setTitle('Lofi API')
    .setDescription('API for Lofi Music Website')
    .setVersion('1.0')
    .addTag('lofi')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
