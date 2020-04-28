import { TrackService } from './track.service';
import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchema } from './track.schema';
import { MulterModule } from '@nestjs/platform-express'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterStorageProvider } from 'src/cloudinary/multerMedia.service';
import { StorageEnum } from 'src/cloudinary/storage.enum';
import { CloudinaryMediaService } from 'src/cloudinary/media.service';
import * as auditPlugin from 'mongoose-audit-trail';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Track',
        useFactory: () => {
          const schema = TrackSchema;
          schema.plugin(auditPlugin.plugin);
          return schema;
        },
      },
    ]),
    MulterModule.registerAsync({
      imports: [CloudinaryModule],
      useFactory: async (multerStorageProvider: MulterStorageProvider) => ({
        storage: multerStorageProvider.getStorage(StorageEnum.MEDIA)
      }),
      inject: [MulterStorageProvider]
    })  
  ],
  controllers: [TrackController],
  providers: [TrackService, CloudinaryMediaService],
})
export class TrackModule {};