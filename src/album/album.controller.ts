import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Post,
  Request,
  UploadedFile,
  Body,
  BadRequestException,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { IsMongoId } from 'class-validator';
import { Album } from './album.interface';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { EditAlbumDTO } from './dto/edit-album.dto';

class AlbumParams{
    @IsMongoId()
    id: string;
}
@Controller('album')
export class AlbumController {

  constructor(private readonly albumService: AlbumService) {}
  @Get('')
  async getPublicAlbums(
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<Album[]> {
    return this.albumService.getPublicAlbums(offset, limit);
  }

  @UseGuards(BearerAuthGuard)
  @Get('private')
  async getPrivateAlbums(
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<Album[]> {
    return this.albumService.getPrivateAlbums(offset, limit);
  }

  @Get(':id')
  async getPublicAlbumById(@Param() params: AlbumParams): Promise<Album> {
    const { id } = params;
    return this.albumService.getPublicAlbumById(id);
  }

  @UseGuards(BearerAuthGuard)
  @Get('private/:id')
  async getPrivateAlbumById(@Param() params: AlbumParams): Promise<Album> {
    const { id } = params;
    return this.albumService.getPrivateAlbumById(id);
  }

  @UseGuards(BearerAuthGuard)
  @Post()
  async createAlbum(
    @Request() req,
    @UploadedFile() file,
    @Body() createAlbumDTO: CreateAlbumDTO,
  ): Promise<Album> {
    const {
      user: { claims },
    } = req;
    return this.albumService.createAlbum(createAlbumDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Patch(':id')
  async editAlbum(
    @Request() req,
    @Param() params: AlbumParams,
    @Body() editAlbumDTO: EditAlbumDTO,
  ): Promise<Album> {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.albumService.editAlbum(id, editAlbumDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Request() req, @Param() params: AlbumParams) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.albumService.deleteAlbum(id, claims.uid);
  }
}
