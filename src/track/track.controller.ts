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
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { CreateTrackDTO } from './dto/create-track.dto';
import { EditTrackDTO } from './dto/edit-track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiOkResponse, ApiParam, ApiBadRequestResponse, ApiCreatedResponse, ApiConsumes, ApiBody, ApiUnprocessableEntityResponse, ApiNotFoundResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { TrackResponse } from '../swagger/responses/track-response.dto';
import { TrackQueries } from './requests/track-queries';
import { TrackParams } from './requests/track-params';
import { TrackUploadRequest } from 'src/swagger/requests/track-upload';
import { Track } from './track.serialize';



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
    const tracks = await this.trackService.getPublicTracks(offset, limit);

    return tracks.map(track => new Track(track.toJSON()))
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
    const tracks = await this.trackService.getPrivateTracks(offset, limit);
    return tracks.map((track) => new Track(track.toJSON()));
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
    const track = await this.trackService.getPublicTrackById(id);
    return new Track(track.toJSON());
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
    const track = await this.trackService.getPrivateTrackById(id);
    return new Track(track.toJSON())
  }

  @ApiOperation({ summary: "Create Track" })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Track Created",
    type: TrackResponse,
  })
  @ApiBadRequestResponse({ description: "Audio is required" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Track Upload",
    type: TrackUploadRequest,
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
    const track = await this.trackService.createTrack(createTrackDTO, claims.uid);
    return new Track(track.toJSON())
  }

  @ApiOperation({ summary: "Update Track" })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Track Updated",
    type: TrackResponse,
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
  async editTrack(
    @Request() req,
    @Param() params: TrackParams,
    @Body() editTrackDTO: EditTrackDTO
  ): Promise<Track> {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    const track = await this.trackService.editTrack(id, editTrackDTO, claims.uid);
    return new Track(track.toJSON());
  }

  @ApiOperation({ summary: "Delete Track" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @ApiNoContentResponse({ description: "Image Deleted" })
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
  async deleteTrack(@Request() req, @Param() params: TrackParams) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    return this.trackService.deleteTrack(id, claims.uid);
  }
}
