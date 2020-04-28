import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  UseInterceptors,
  Request,
  UploadedFile,
  Body,
  BadRequestException,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { IsMongoId } from 'class-validator';
import { Image } from './image.interface';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDTO } from './dto/create-image.dto';
import { EditImageDTO } from './dto/edit-image.dto';

class ImageParams {
  @IsMongoId()
  id: string;
}

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':id')
  async getPublicImageById(@Param() params: ImageParams): Promise<Image> {
    const { id } = params;
    return this.imageService.getPublicImageById(id);
  }

  @UseGuards(BearerAuthGuard)
  @Get('private/:id')
  async getPrivateImageById(@Param() params: ImageParams): Promise<Image> {
    const { id } = params;
    return this.imageService.getPrivateImageById(id);
  }

  @UseGuards(BearerAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createImage(
    @Request() req,
    @UploadedFile() file,
    @Body() createImageDTO: CreateImageDTO,
  ): Promise<Image> {
    const {
      user: { claims },
    } = req;
    if (!file) {
      throw new BadRequestException(file, 'Image is required');
    }
    createImageDTO.path = file.path;
    return this.imageService.createImage(createImageDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async editImage(
    @Request() req,
    @Param() params: ImageParams,
    @UploadedFile() file,
    @Body() editImageDTO: EditImageDTO,
  ): Promise<Image> {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    
    editImageDTO.path = file.path;
    return this.imageService.editImage(id, editImageDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteImage(@Request() req, @Param() params: ImageParams) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.imageService.deleteImage(id, claims.uid);
  }
}
