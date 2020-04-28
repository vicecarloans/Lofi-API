import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './track.interface';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { CreateTrackDTO } from './dto/create-track.dto';
import { EditTrackDTO } from './dto/edit-track.dto';
import { IsMongoId } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

class TrackParams {
  @IsMongoId()
  id: string;
}
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('')
  async getPublicTracks(
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<Track[]> {
    return this.trackService.getPublicTracks(offset, limit);
  }

  @UseGuards(BearerAuthGuard)
  @Get('private')
  async getPrivateTracks(
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<Track[]> {
    return this.trackService.getPrivateTracks(offset, limit);
  }

  @Get(':id')
  async getPublicTrackById(@Param() params: TrackParams): Promise<Track> {
    const { id } = params;
    return this.trackService.getPublicTrackById(id);
  }

  @UseGuards(BearerAuthGuard)
  @Get('private/:id')
  async getPrivateTrackById(@Param() params: TrackParams): Promise<Track> {
    const { id } = params;
    return this.trackService.getPrivateTrackById(id);
  }

  @UseGuards(BearerAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async createTrack(
    @Request() req,
    @UploadedFile() file,
    @Body() createTrackDTO: CreateTrackDTO,
  ): Promise<Track> {
    const {
      user: { claims },
    } = req;
    if (!file) {
      throw new BadRequestException(file, 'Audio is required');
    }
    createTrackDTO.path = file.path;
    return this.trackService.createTrack(createTrackDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Patch(':id')
  async editTrack(
    @Request() req,
    @Param() params: TrackParams,
    @Body() editTrackDTO: EditTrackDTO,
  ): Promise<Track> {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.trackService.editTrack(id, editTrackDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(@Request() req, @Param() params: TrackParams) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.trackService.deleteTrack(id, claims.uid);
  }
}
