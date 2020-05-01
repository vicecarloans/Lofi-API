import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Upload } from './upload.interface';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { UploadEndpointParams } from './requests/upload-params';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { UploadResponse } from 'src/swagger/responses/upload-response.dto';

@ApiTags("Upload Endpoints")
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({description: "Get Upload Details By Id"})
  @ApiParam({name: "id"})
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Upload Found",
    type: UploadResponse
  })
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
