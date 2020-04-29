import { TrackService } from './track.service';
import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchema } from './track.schema';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterStorageProvider } from 'src/cloudinary/multerMedia.service';
import { StorageEnum } from 'src/cloudinary/storage.enum';

import { UploadService } from 'src/upload/upload.service';
import { BullModule } from '@nestjs/bull';
import { UploadSchema } from 'src/upload/upload.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Track',
        useFactory: () => {
          const schema = TrackSchema;

          return schema;
        },
      },
      {
        name: 'Upload',
        useFactory: () => {
          const schema = UploadSchema;
          return schema;
        },
      },
    ]),
    MulterModule.registerAsync({
      imports: [CloudinaryModule],
      useFactory: async (multerStorageProvider: MulterStorageProvider) => ({
        storage: multerStorageProvider.getStorage(StorageEnum.MEDIA),
      }),
      inject: [MulterStorageProvider],
    }),
    BullModule.registerQueueAsync({
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
    }),
  ],
  controllers: [TrackController],
  providers: [TrackService, UploadService],
})
export class TrackModule {}
