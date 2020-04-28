import { Module } from '@nestjs/common';
import { CloudinaryMediaService } from './media.service';
import { CloudinaryImageService } from './images.service';
import { MulterStorageProvider } from './multerMedia.service';
import { TrackService } from 'src/track/track.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchema } from 'src/track/track.schema';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLoggerService } from 'src/logger/applogger.service';
import { ImageSchema } from 'src/image/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Track',
        schema: TrackSchema
      },
      {
        name: 'Image',
        schema: ImageSchema
      },
    ]),
    LoggerModule,
  ],
  controllers: [],
  providers: [
    CloudinaryMediaService,
    CloudinaryImageService,
    MulterStorageProvider,
    TrackService,
    AppLoggerService,
  ],
  exports: [
    CloudinaryMediaService,
    CloudinaryImageService,
    MulterStorageProvider,
  ],
})
export class CloudinaryModule {}
