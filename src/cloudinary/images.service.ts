import { Injectable, Scope } from "@nestjs/common";
import * as uploadLib from 'cloudinary'
import { ConfigService } from "@nestjs/config";
import { CloudinaryResponse } from "./cloudinary.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Image } from 'src/image/image.interface'
import { Model } from "mongoose";
import { AppLoggerService } from "src/logger/applogger.service";

@Injectable()
export class CloudinaryImageService {
    cloudinary: any;
    storage: any;
    constructor(private readonly configService: ConfigService, @InjectModel("Image") private readonly imageModel : Model<Image>, private logger: AppLoggerService) {
        this.cloudinary = uploadLib
        this.cloudinary.v2.config({
            "cloud_name": this.configService.get<string>('CLOUDINARY_NAME'),
            "api_key": this.configService.get<string>('CLOUDINARY_API_KEY'),
            "api_secret": this.configService.get<string>('CLOUDINARY_SECRET'),
        });
    }

    uploadImage(path : string, imageId: string){
        return this.cloudinary.v2.uploader.upload(path, async (err, result : CloudinaryResponse) => {
            const payload = await this.imageModel.findByIdAndUpdate(imageId, {path: result.secure_url}, {new: true})
            this.logger.log(`Finish Upload Image: ${imageId}`)
            this.logger.log(payload)
        })
    }
}