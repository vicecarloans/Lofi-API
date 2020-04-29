import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadSchema } from './upload.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Upload',
        useFactory: () => {
          const schema = UploadSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
