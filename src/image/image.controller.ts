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
import { Image } from './image.interface';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDTO } from './dto/create-image.dto';
import { EditImageDTO } from './dto/edit-image.dto';
import { ApiOperation, ApiBearerAuth, ApiOkResponse, ApiParam, ApiBadRequestResponse, ApiCreatedResponse, ApiConsumes, ApiBody, ApiNoContentResponse, ApiNotFoundResponse, ApiUnprocessableEntityResponse, ApiTags } from '@nestjs/swagger';
import { ImageResponse } from 'src/swagger/responses/image-response.dto';
import { ImageUploadDTO } from './dto/image-upload.dto';
import { ImageParams } from './requests/image-params';


@ApiTags("Image Endpoints")
@Controller("image")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: "Get Public Image By Id" })
  @ApiParam({ name: "id" })
  @ApiOkResponse({
    description: "Image found",
    type: ImageResponse,
  })
  @ApiBadRequestResponse({ description: "Invalid Fields" })
  @Get(":id")
  async getPublicImageById(@Param() params: ImageParams): Promise<Image> {
    const { id } = params;
    return this.imageService.getPublicImageById(id);
  }

  @ApiOperation({ summary: "Get Private Image By Id" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @ApiOkResponse({
    description: "Image found",
    type: ImageResponse,
  })
  @ApiBadRequestResponse({ description: "Invalid Fields" })
  @UseGuards(BearerAuthGuard)
  @Get("private/:id")
  async getPrivateImageById(@Param() params: ImageParams): Promise<Image> {
    const { id } = params;
    return this.imageService.getPrivateImageById(id);
  }

  @ApiOperation({ summary: "Create Image" })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Image Created",
    type: ImageResponse,
  })
  @ApiBadRequestResponse({ description: "Image is required" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Image Upload",
    type: ImageUploadDTO,
  })
  @UseGuards(BearerAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async createImage(
    @Request() req,
    @UploadedFile() file,
    @Body() createImageDTO: CreateImageDTO
  ): Promise<Image> {
    const {
      user: { claims },
    } = req;
    if (!file) {
      throw new BadRequestException(file, "Image is required");
    }
    createImageDTO.path = file.path;
    return this.imageService.createImage(createImageDTO, claims.uid);
  }

  @ApiOperation({ summary: "Edit Image" })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Image Edited",
    type: ImageResponse,
  })
  @ApiParam({ name: "id" })
  @ApiBadRequestResponse({ description: "Image is required" })
  @ApiUnprocessableEntityResponse({
    description: "Update payload should include at least one updatable field",
  })
  @ApiNotFoundResponse({
    description:
      "No record was found or you might not have permission to update this record",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Image Upload",
    type: ImageUploadDTO,
  })
  @UseGuards(BearerAuthGuard)
  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  async editImage(
    @Request() req,
    @Param() params: ImageParams,
    @UploadedFile() file,
    @Body() editImageDTO: EditImageDTO
  ): Promise<Image> {
    const {
      user: { claims },
    } = req;
    const { id } = params;

    editImageDTO.path = file.path;
    return this.imageService.editImage(id, editImageDTO, claims.uid);
  }

  @ApiOperation({ summary: "Delete image" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @ApiNoContentResponse({ description: "Image Deleted" })
  @ApiNotFoundResponse({
    description:
      "No record was found or you might not have permission to update this record",
  })
  @UseGuards(BearerAuthGuard)
  @Delete(":id")
  @HttpCode(204)
  async deleteImage(@Request() req, @Param() params: ImageParams) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.imageService.deleteImage(id, claims.uid);
  }
}
