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
import { IsMongoId, IsNumber } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiOkResponse, ApiParam, ApiBadRequestResponse, ApiCreatedResponse, ApiConsumes, ApiBody, IntersectionType, OmitType } from '@nestjs/swagger';
import { TrackResponse } from './dto/track-response.dto';
import { TrackQueries } from './requests/track-queries';
import { TrackParams } from './requests/track-params';
import { TrackUploadDTO } from './dto/track-upload.dto';



@ApiTags("Track Endpoints")
@Controller("track")
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({ summary: "Get Public Tracks" })
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
  @ApiOkResponse({ description: "Query Success", type: [TrackResponse] })
  @Get("")
  async getPublicTracks(@Query() queryParams: TrackQueries): Promise<Track[]> {
    const { offset = 0, limit = 25 } = queryParams;
    return this.trackService.getPublicTracks(offset, limit);
  }

  @ApiOperation({ summary: "Get Private Tracks" })
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
  @ApiOkResponse({ description: "Query Success", type: [TrackResponse] })
  @UseGuards(BearerAuthGuard)
  @Get("private")
  async getPrivateTracks(@Query() queryParams: TrackQueries): Promise<Track[]> {
    const { offset = 0, limit = 25 } = queryParams;
    return this.trackService.getPrivateTracks(offset, limit);
  }

  @ApiOperation({ summary: "Get Public Track By Id" })
  @ApiParam({ name: "id" })
  @ApiOkResponse({
    description: "Track Found",
    type: TrackResponse,
  })
  @Get(":id")
  async getPublicTrackById(@Param() params: TrackParams): Promise<Track> {
    const { id } = params;
    return this.trackService.getPublicTrackById(id);
  }

  @ApiOperation({ summary: "Get Private Track By Id" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @ApiOkResponse({
    description: "Track Found",
    type: TrackResponse,
  })
  @UseGuards(BearerAuthGuard)
  @Get("private/:id")
  async getPrivateTrackById(@Param() params: TrackParams): Promise<Track> {
    const { id } = params;
    return this.trackService.getPrivateTrackById(id);
  }

  @ApiOperation({ summary: "Create Track" })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Image Created",
    type: TrackResponse,
  })
  @ApiBadRequestResponse({ description: "Audio is required" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Image Upload",
    type: IntersectionType(OmitType(CreateTrackDTO, ["path"]), TrackUploadDTO),
  })
  @UseGuards(BearerAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("audio"))
  async createTrack(
    @Request() req,
    @UploadedFile() file,
    @Body() createTrackDTO: CreateTrackDTO
  ): Promise<Track> {
    const {
      user: { claims },
    } = req;
    if (!file) {
      throw new BadRequestException(file, "Audio is required");
    }
    createTrackDTO.path = file.path;
    return this.trackService.createTrack(createTrackDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Patch(":id")
  async editTrack(
    @Request() req,
    @Param() params: TrackParams,
    @Body() editTrackDTO: EditTrackDTO
  ): Promise<Track> {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.trackService.editTrack(id, editTrackDTO, claims.uid);
  }

  @UseGuards(BearerAuthGuard)
  @Delete(":id")
  @HttpCode(204)
  async deleteTrack(@Request() req, @Param() params: TrackParams) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.trackService.deleteTrack(id, claims.uid);
  }
}
