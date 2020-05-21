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
  Put,
} from "@nestjs/common";
import { AlbumService } from "./album.service";
import { BearerAuthGuard } from "src/auth/bearer-auth.guard";
import { Album } from "./album.serialize";
import { CreateAlbumDTO } from "./dto/create-album.dto";
import { EditAlbumDTO } from "./dto/edit-album.dto";
import { AlbumParams } from "./requests/album-params";
import { AlbumQueries } from "./requests/album-queries";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from "@nestjs/swagger";
import { AlbumResponse } from "src/swagger/responses/album-response.dto";
import { omit } from "lodash";
import { AlbumVotingDTO } from "./dto/album-vote.dto";
import { VoteTypeEnum } from "src/vote/vote.enum";

@ApiTags("Album Endpoints")
@Controller("album")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  // GET Endpoints
  // -- Get Public Recently Added Albums
  @ApiOperation({ summary: "Get Public Recently Added Albums" })
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
    const albums = await this.albumService.getPublicAlbums(offset, limit);

    return albums.map((album) => new Album(album.toJSON()));
  }

  // -- Get Private Recently Added Albums
  @ApiOperation({ summary: "Get Private Recently Added Albums" })
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
    const albums = await this.albumService.getPrivateAlbums(offset, limit);
    return albums.map((album) => new Album(album.toJSON()));
  }

  // -- Get Public Popular Albums
  @ApiOperation({ summary: "Get Public Popular Albums based on Votes" })
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
  @Get("popular")
  async getPublicPopularAlbums(
    @Query() queryParams: AlbumQueries
  ): Promise<Album[]> {
    const { offset = 0, limit = 25 } = queryParams;
    const albums = await this.albumService.getPublicPopularAlbums(
      offset,
      limit
    );
    return albums.map((album) => new Album(album.toJSON()));
  }

  // -- Get Private Popular Albums
  @ApiOperation({ summary: "Get Private Popular Albums based on Votes" })
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
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Query Success", type: [AlbumResponse] })
  @UseGuards(BearerAuthGuard)
  @Get("private/popular")
  async getPrivatePopularAlbums(
    @Query() queryParams: AlbumQueries
  ): Promise<Album[]> {
    const { offset = 0, limit = 25 } = queryParams;
    const albums = await this.albumService.getPrivatePopularAlbums(
      offset,
      limit
    );
    return albums.map((album) => new Album(album.toJSON()));
  }

  // -- Get Public Album By Id
  @ApiOperation({ summary: "Get Public Album By Id" })
  @ApiParam({ name: "id" })
  @ApiOkResponse({ description: "Query Success", type: [AlbumResponse] })
  @Get(":id")
  async getPublicAlbumById(@Param() params: AlbumParams): Promise<Album> {
    const { id } = params;
    const album = await this.albumService.getPublicAlbumById(id);
    return new Album(album.toJSON());
  }

  // -- Get Private Album By Id
  @ApiOperation({ summary: "Get Private Album By Id" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @ApiOkResponse({ description: "Query Success", type: [AlbumResponse] })
  @UseGuards(BearerAuthGuard)
  @Get("private/:id")
  async getPrivateAlbumById(@Param() params: AlbumParams): Promise<Album> {
    const { id } = params;
    const album = await this.albumService.getPrivateAlbumById(id);
    return new Album(album.toJSON());
  }

  // POST
  // -- Create new Album
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
    const album = await this.albumService.createAlbum(
      createAlbumDTO,
      claims.uid
    );
    return new Album(omit(album.toJSON(), ["tracks", "image"]));
  }

  // PATCH
  // -- Update Album Attributes
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
    const album = await this.albumService.editAlbum(
      id,
      editAlbumDTO,
      claims.uid
    );
    return new Album(omit(album.toJSON(), ["tracks", "image"]));
  }

  // PUT
  // -- Vote Album
  @ApiOperation({
    summary: "Vote an Album. Call the same endpoint twice will unvote",
  })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @ApiNoContentResponse({ description: "Vote Registered" })
  @UseGuards(BearerAuthGuard)
  @Put("vote/:id")
  @HttpCode(204)
  async voteAlbum(
    @Request() req,
    @Param() params: AlbumParams,
    @Body() albumVotingDTO: AlbumVotingDTO
  ) {
    const {
      user: { claims },
    } = req;
    const { id } = params;
    const { type } = albumVotingDTO;
    if (type === VoteTypeEnum.UPVOTE) {
      return this.albumService.upvoteAlbum(id, claims.uid);
    }
    if (type === VoteTypeEnum.DOWNVOTE) {
      return this.albumService.downvoteAlbum(id, claims.uid);
    }
  }

  // DELETE
  // -- Delete Album
  @ApiOperation({ summary: "Delete Album" })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Album Deleted",
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
