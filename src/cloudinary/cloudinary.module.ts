import { Module } from '@nestjs/common';
import { MulterStorageProvider } from './multerMedia.service';

import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchema } from 'src/track/track.schema';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLoggerService } from 'src/logger/applogger.service';
import { ImageSchema } from 'src/image/image.schema';
import { BullModule } from '@nestjs/bull';
import { CloudinaryImageQueueConsumer } from './image.consumer';
import { CloudinaryAudioQueueConsumer } from './audio.consumer';

import { UploadSchema } from 'src/upload/upload.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Track',
        schema: TrackSchema,
      },
      {
        name: 'Image',
        schema: ImageSchema,
      },
      {
        name: 'Upload',
        schema: UploadSchema,
      },
    ]),
    BullModule.registerQueue({ name: 'audio' }, { name: 'image' }),
    LoggerModule,
  ],
  controllers: [],
  providers: [
    MulterStorageProvider,
    AppLoggerService,
    CloudinaryImageQueueConsumer,
    CloudinaryAudioQueueConsumer,
  ],
  exports: [MulterStorageProvider],
})
export class CloudinaryModule {}
