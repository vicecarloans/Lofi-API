import { Injectable } from "@nestjs/common";
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StorageEnum } from "./storage.enum";



@Injectable()
export class MulterStorageProvider{
    mediaStorage: any;
    imageStorage: any;
    constructor(){
        this.mediaStorage = diskStorage({
            destination: "assets/media",
            filename: (req, file, cb) => {
                return cb(null, `${uuidv4()}${extname(file.originalname)}`)
            }
        })
        this.imageStorage = diskStorage({
          destination: 'assets/images',
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