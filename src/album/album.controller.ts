import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Post,
  Request,
  Body,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { Album } from './album.interface';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { EditAlbumDTO } from './dto/edit-album.dto';
import { AlbumParams } from './requests/album-params';
import { AlbumQueries } from './requests/album-queries';
import { ApiTags, ApiOperation, ApiQuery, ApiOkResponse, ApiBearerAuth, ApiParam, ApiCreatedResponse, ApiUnprocessableEntityResponse, ApiNotFoundResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { AlbumResponse } from 'src/swagger/responses/album-response.dto';


@ApiTags("Album Endpoints")
@Controller("album")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiOperation({ summary: "Get Public Albums" })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 25,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    example: 0,
  })
  @ApiOkResponse({ description: "Query Success", type: [AlbumResponse] })
  @Get("")
  async getPublicAlbums(@Query() queryParams: AlbumQueries): Promise<Album[]> {
    const { offset = 0, limit = 25 } = queryParams;
    return this.albumService.getPublicAlbums(offset, limit);
  }

  @ApiOperation({ summary: "Get Private Albums" })
  @ApiBearerAuth()
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 25,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    example: 0,
  })
  @ApiOkResponse({ description: "Query Success", type: [AlbumResponse] })
  @UseGuards(BearerAuthGuard)
  @Get("private")
  async getPrivateAlbums(@Query() queryParams: AlbumQueries): Promise<Album[]> {
    const { offset = 0, limit = 25 } = queryParams;
    return this.albumService.getPrivateAlbums(offset, limit);
  }

  @ApiOperation({ summary: "Get Public Albums" })
  @ApiParam({ name: "id" })
  @ApiOkResponse({ description: "Query Success", type: [AlbumResponse] })
  @Get(":id")
  async getPublicAlbumById(@Param() params: AlbumParams): Promise<Album> {
    const { id } = params;
    return this.albumService.getPublicAlbumById(id);
  }

  @ApiOperation({ summary: "Get Private Album By Id" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @ApiOkResponse({ description: "Query Success", type: [AlbumResponse] })
  @UseGuards(BearerAuthGuard)
  @Get("private/:id")
  async getPrivateAlbumById(@Param() params: AlbumParams): Promise<Album> {
    const { id } = params;
    return this.albumService.getPrivateAlbumById(id);
  }

  @ApiOperation({ summary: "Create Album" })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Album Created", type: AlbumResponse })
  @UseGuards(BearerAuthGuard)
  @Post("")
  async createAlbum(
    @Request() req,
    @Body() createAlbumDTO: CreateAlbumDTO
  ): Promise<Album> {
    const {
      user: { claims },
    } = req;
    return this.albumService.createAlbum(createAlbumDTO, claims.uid);
  }

  @ApiOperation({ summary: "Update Album" })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Album Updated",
    type: AlbumResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: "Update payload should include at least one updatable field",
  })
  @ApiNotFoundResponse({
    description:
      "No record was found or you might not have permission to update this record",
  })
  @UseGuards(BearerAuthGuard)
  @Patch(":id")
  async editAlbum(
    @Request() req,
    @Param() params: AlbumParams,
    @Body() editAlbumDTO: EditAlbumDTO
  ): Promise<Album> {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.albumService.editAlbum(id, editAlbumDTO, claims.uid);
  }

  @ApiOperation({ summary: "Delete Album" })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Album Deleted"
  })
  @ApiUnprocessableEntityResponse({
    description: "Update payload should include at least one updatable field",
  })
  @ApiNotFoundResponse({
    description:
      "No record was found or you might not have permission to update this record",
  })
  @UseGuards(BearerAuthGuard)
  @Delete(":id")
  @HttpCode(204)
  async deleteAlbum(@Request() req, @Param() params: AlbumParams) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.albumService.deleteAlbum(id, claims.uid);
  }
}
