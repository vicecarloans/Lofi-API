import { Module } from '@nestjs/common';
import { CloudinaryMediaService } from './media.service';
import { CloudinaryImageService } from './images.service';
import { MulterStorageProvider } from './multerMedia.service';
import { TrackService } from 'src/track/track.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchema } from 'src/track/track.schema';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLoggerService } from 'src/logger/applogger.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Track',
        useFactory: () => {
          const schema = TrackSchema;
          schema.post('save', doc => {
            doc.overwrite({
              updatedAt: Date.now().toLocaleString('en-US'),
            });
          });
          return schema;
        },
      },
    ]),
    LoggerModule
  ],
  controllers: [],
  providers: [
    CloudinaryMediaService,
    CloudinaryImageService,
    MulterStorageProvider,
    TrackService,
    AppLoggerService
  ],
  exports: [
    CloudinaryMediaService,
    CloudinaryImageService,
    MulterStorageProvider,
  ],
})
export class CloudinaryModule {}
