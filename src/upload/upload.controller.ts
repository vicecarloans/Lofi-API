import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UploadService } from './upload.service';
import { IsMongoId } from 'class-validator';
import { Upload } from './upload.interface';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';

class UploadEndpointParams {
  @IsMongoId()
  id: string;
}
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(BearerAuthGuard)
  @Get(':id')
  async getUploadInfoByIdHandler(
    @Param() params: UploadEndpointParams,
    @Request() req,
  ): Promise<Upload> {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.uploadService.getUploadInfoById(id, claims.uid);
  }
}
