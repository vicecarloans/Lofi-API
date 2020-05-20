/* eslint-disable @typescript-eslint/camelcase */
import * as uploadLib from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryResponse } from './cloudinary.interface';
import { InjectModel } from '@nestjs/mongoose';
import { IImage } from 'src/image/image.interface';
import { Model } from 'mongoose';
import { AppLoggerService } from 'src/logger/applogger.service';
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { QueueImageDTO } from 'src/image/dto/queue-image.dto';

import { UploadStatusEnum } from 'src/upload/enum/upload-status.enum';

import { IUpload } from 'src/upload/upload.interface';

@Processor("image")
export class CloudinaryImageQueueConsumer {
  cloudinary: any;
  storage: any;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel("Image") private readonly imageModel: Model<IImage>,
    @InjectModel("Upload") private readonly uploadModel: Model<IUpload>,
    private logger: AppLoggerService
  ) {
    this.cloudinary = uploadLib;
    this.cloudinary.v2.config({
      cloud_name: this.configService.get<string>("CLOUDINARY_NAME"),
      api_key: this.configService.get<string>("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get<string>("CLOUDINARY_SECRET"),
    });
  }

  @Process("upload")
  uploadImage(job: Job<QueueImageDTO>) {
    const { path, imageId } = job.data;
    return this.cloudinary.v2.uploader.upload(
      path,
      {
        folder: "lofi-res/images",
      },
      async (err, result: CloudinaryResponse) => {
        const payload = await this.imageModel.findByIdAndUpdate(
          imageId,
          { path: result.secure_url },
          { new: true }
        );
        await this.uploadModel.findByIdAndUpdate(job.id.toString(), {
          status: UploadStatusEnum.COMPLETE_UPLOAD,
        });
        this.logger.log(`Finish Upload Image: ${imageId}`);
        this.logger.log(payload);
      }
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data
      )}`
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result) {
    this.logger.log(
      `Job ${job.id} of type ${
        job.name
      } has been processed successfully. Result: ${JSON.stringify(result)}`
    );
  }
}
