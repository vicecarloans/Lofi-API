import { ImageService } from './image.service';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './image.schema';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterStorageProvider } from 'src/cloudinary/multerMedia.service';
import { StorageEnum } from 'src/cloudinary/storage.enum';
import { CloudinaryImageService } from 'src/cloudinary/images.service';
import * as auditPlugin from 'mongoose-audit-trail';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Image',
        useFactory: () => {
          const schema = ImageSchema;
          schema.plugin(auditPlugin.plugin)
          return schema;
        },
      },
    ]),
    MulterModule.registerAsync({
      imports: [CloudinaryModule],
      useFactory: async (multerStorageProvider: MulterStorageProvider) => ({
        storage: multerStorageProvider.getStorage(StorageEnum.IMAGE),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"]
          if(allowedMimeTypes.includes(file.mimetype)){
            cb(null, true);
            return
          }
          cb(null, false);
          
        }
      }),
      inject: [MulterStorageProvider],
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService, CloudinaryImageService],
})
export class ImageModule {}
