import { Injectable, Scope } from "@nestjs/common";
import * as uploadLib from 'cloudinary'
import { ConfigService } from "@nestjs/config";
import { CloudinaryResponse } from "./cloudinary.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Track } from "src/track/track.interface";
import { AppLoggerService } from "src/logger/applogger.service";

@Injectable()
export class CloudinaryMediaService {
  cloudinary: any;
  storage: any;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Track') private readonly trackModel: Model<Track>,
    private logger: AppLoggerService
  ) {
    this.cloudinary = uploadLib;
    this.cloudinary.v2.config({
      "cloud_name": this.configService.get<string>('CLOUDINARY_NAME'),
      "api_key": this.configService.get<string>('CLOUDINARY_API_KEY'),
      "api_secret": this.configService.get<string>('CLOUDINARY_SECRET'),
    });
  }

  uploadAudio(path: string, audioId: string) {
    this.cloudinary.v2.uploader.upload_large(
      path,
      {
        "resource_type": 'video',
        folder: 'lofi-res/media',
      },
      async (err, result : CloudinaryResponse) => {
        const payload = await this.trackModel.findByIdAndUpdate(audioId, {path: result.secure_url}, {new: true});
        this.logger.log(`Finish Writing Track ${audioId}`);
        this.logger.log(payload);
      },
    );
  }
}