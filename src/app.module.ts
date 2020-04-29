import { NotificationModule } from './notification/notification.module';
import { UploadModule } from './upload/upload.module';
import { ImageModule } from './image/image.module';
import { AppLoggerService } from './logger/applogger.service';
import { AlbumModule } from './album/album.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpStrategy } from './auth/http.strategy';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
        NotificationModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync(
      {
        name: 'audio',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          redis: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'image',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          redis: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD'),
          },
        }),
        inject: [ConfigService],
      },
    ),
    UserModule,
    AlbumModule,
    TrackModule,
    ImageModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppLoggerService, HttpStrategy, AuthService],
})
export class AppModule {}
