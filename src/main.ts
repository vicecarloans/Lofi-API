
import * as env from "dotenv";
env.config();
import * as helmet from "helmet";
import * as rateLimit from "express-rate-limit";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppLoggerService } from './logger/applogger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({skipMissingProperties: true}));
  app.enableCors({
    origin: ["http://localhost:3000", "https://lofi.huydam.guru"],
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );
  app.use(helmet());
  app.useLogger(app.get(AppLoggerService));
  //Swagger
  const options = new DocumentBuilder()
    .setTitle('Lofi API')
    .setDescription('API for Lofi Music Website')
    .setVersion('1.0.1')
    .addTag('lofi')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  await app.listen(parseInt(process.env.PORT) || 5000);
}
bootstrap();
