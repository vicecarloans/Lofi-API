import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
