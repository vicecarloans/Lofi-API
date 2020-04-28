import { Injectable } from "@nestjs/common";
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StorageEnum } from "./storage.enum";
import { join } from 'path'
import { tmpdir } from 'os'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MulterStorageProvider{
    mediaStorage: any;
    imageStorage: any;
    constructor(private readonly configService: ConfigService){
        this.mediaStorage = diskStorage({
          destination:
            this.configService.get<string>("NODE_ENV") === 'PRODUCTION'
              ? join(tmpdir(), 'assets/media')
              : 'assets/media',
          filename: (req, file, cb) => {
            return cb(null, `${uuidv4()}${extname(file.originalname)}`);
          },
        });
        this.imageStorage = diskStorage({
          destination: this.configService.get<string>('NODE_ENV') === 'PRODUCTION'
            ? join(tmpdir(), 'assets/images')
            : 'assets/images',
          filename: (req, file, cb) => {
            return cb(null, `${uuidv4()}${extname(file.originalname)}`);
          },
        });   
    }

    getStorage(type: StorageEnum) : any{
        if(type === StorageEnum.MEDIA){
            return this.mediaStorage;
        }
        return this.imageStorage;
    }
}