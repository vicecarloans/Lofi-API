import { Injectable, Scope } from "@nestjs/common";
import * as uploadLib from 'cloudinary'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudinaryImageService {
    cloudinary: any;
    storage: any;
    constructor(private readonly configService: ConfigService) {
        this.cloudinary = uploadLib
        this.cloudinary.v2.config({
            "cloud_name": this.configService.get<string>('CLOUDINARY_NAME'),
            "api_key": this.configService.get<string>('CLOUDINARY_API_KEY'),
            "api_secret": this.configService.get<string>('CLOUDINARY_SECRET'),
        });
    }

    uploadImage(path : string, imageId: string){
        return this.storage
    }
}