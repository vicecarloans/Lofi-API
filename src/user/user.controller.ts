import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Body,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from './user.interface';
import { UpsertUserDTORequest } from './dto/upsert-user.dto';
import { ApiOperation, ApiQuery, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserTracksResponse, UserAlbumsResponse, UserUploadsReponse, UserNotificationsResponse } from './dto/user-response.dto';
import { UserQueries } from './requests/user-queries';


@ApiTags("User Endpoints")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Get My Favourite Tracks" })
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
  @ApiOkResponse({ description: "Query Success", type: UserTracksResponse })
  @UseGuards(BearerAuthGuard)
  @Get("me/favourites/tracks")
  async getMyFavouriteTracks(
    @Request() req,
    @Query() queryParams: UserQueries
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const { offset = 0, limit = 25 } = queryParams;
    const data = await this.userService.getUserFavouriteTracks(
      claims.uid,
      offset,
      limit
    );
    return data;
  }

  @ApiOperation({ summary: "Get My Favourite Albums" })
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
  @ApiOkResponse({ description: "Query Success", type: UserAlbumsResponse })
  @UseGuards(BearerAuthGuard)
  @Get("me/favourites/albums")
  async getMyFavouriteAlbums(
    @Request() req,
    @Query() queryParams: UserQueries
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const { offset = 0, limit = 25 } = queryParams;
    const data = await this.userService.getUserFavouriteAlbums(
      claims.uid,
      offset,
      limit
    );
    return data;
  }

  @ApiOperation({ summary: "Get My Uploads" })
  @ApiBearerAuth()
  @ApiQuery({
    name: "limit",
    required: false,
    example: 25,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    example: "0",
  })
  @ApiOkResponse({ description: "Query Success", type: UserUploadsReponse })
  @UseGuards(BearerAuthGuard)
  @Get("me/uploads")
  async getMyUploads(
    @Request() req,
    @Query() queryParams: UserQueries
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const { offset = 0, limit = 25 } = queryParams;
    const data = await this.userService.getUserUploads(
      claims.uid,
      offset,
      limit
    );
    return data;
  }

  @ApiOperation({ summary: "Get My Notifications" })
  @ApiBearerAuth()
  @ApiQuery({
    name: "limit",
    required: false,
    example: 25,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    example: "0",
  })
  @ApiOkResponse({
    description: "Query Success",
    type: UserNotificationsResponse,
  })
  @UseGuards(BearerAuthGuard)
  @Get("me/notifications")
  async getMyNotifications(
    @Request() req,
    @Query() queryParams: UserQueries
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const { offset = 0, limit = 25 } = queryParams;
    const data = await this.userService.getUserNotifications(
      claims.uid,
      offset,
      limit
    );
    return data;
  }

  @ApiOperation({ summary: "Create or Update My User Data" })
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @HttpCode(201)
  @UseGuards(BearerAuthGuard)
  @Put("me")
  async upsertUserProfile(
    @Request() req,
    @Body() upsertUserDTO: UpsertUserDTORequest
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    return this.userService.updateOrCreateFavourite(upsertUserDTO, claims.uid);
  }
}
