/* eslint-disable @typescript-eslint/camelcase */
import * as uploadLib from 'cloudinary';
import {} from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { CloudinaryResponse } from './cloudinary.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track } from 'src/track/track.interface';
import { AppLoggerService } from 'src/logger/applogger.service';
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { QueueTrackDTO } from 'src/track/dto/queue-track.dto';
import { UploadStatusEnum } from 'src/upload/enum/upload-status.enum';

import { Upload } from 'src/upload/upload.interface';

@Processor('audio')
export class CloudinaryAudioQueueConsumer {
  cloudinary: any;
  storage: any;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Track') private readonly trackModel: Model<Track>,
    @InjectModel('Upload') private readonly uploadModel: Model<Upload>,
    private logger: AppLoggerService,
  ) {
    this.cloudinary = uploadLib;
    this.cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_SECRET'),
    });
  }

  @Process('upload')
  uploadAudio(job: Job<QueueTrackDTO>) {
    const { path, trackId } = job.data;
    this.cloudinary.v2.uploader.upload_large(
      path,
      {
        resource_type: 'video',
        folder: 'lofi-res/media',
      },
      async (err, result: CloudinaryResponse) => {
        const payload = await this.trackModel.findByIdAndUpdate(
          trackId,
          { path: result.secure_url },
          { new: true },
        );
        await this.uploadModel.findByIdAndUpdate(job.id.toString(), {
          status: UploadStatusEnum.COMPLETE_UPLOAD,
        });
        this.logger.log(`Finish Writing Track ${trackId}`);
        this.logger.log(payload);
      },
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result) {
    this.logger.log(
      `Job ${job.id} of type ${job.name} has been processed successfully. Result: ${result}`,
    );
  }
}
