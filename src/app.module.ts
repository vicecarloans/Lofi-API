import { VoteModule } from './vote/vote.module';
import { NotificationModule } from './notification/notification.module';
import { UploadModule } from './upload/upload.module';
import { ImageModule } from './image/image.module';
import { AppLoggerService } from './logger/applogger.service';
import { AlbumModule } from './album/album.module';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpStrategy } from './auth/http.strategy';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { APP_INTERCEPTOR } from '@nestjs/core';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    UploadModule,
    UserModule,
    AlbumModule,
    TrackModule,
    ImageModule,
    NotificationModule,
    VoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppLoggerService,
    HttpStrategy,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {}
