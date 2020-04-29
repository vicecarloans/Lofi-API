import { ImageService } from './image.service';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './image.schema';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterStorageProvider } from 'src/cloudinary/multerMedia.service';
import { StorageEnum } from 'src/cloudinary/storage.enum';

import { BullModule } from '@nestjs/bull';
import { UploadSchema } from 'src/upload/upload.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Image',
        useFactory: () => {
          const schema = ImageSchema;
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
        storage: multerStorageProvider.getStorage(StorageEnum.IMAGE),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
            return;
          }
          cb(null, false);
        },
      }),
      inject: [MulterStorageProvider],
    }),
    BullModule.registerQueueAsync({
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
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
