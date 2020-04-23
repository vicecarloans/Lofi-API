import { AppLoggerService } from './logger/applogger.service';
import { LoggerModule } from './logger/logger.module';
import { AlbumModule } from './album/album.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpStrategy } from './auth/http.strategy'
import { AuthService } from './auth/auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AlbumModule,
    TrackModule,
  ],
  controllers: [AppController],
  providers: [AppLoggerService, HttpStrategy, AuthService],
})
export class AppModule {}
