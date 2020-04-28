import { Controller, Get, UseGuards, Request, Query, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from './user.interface';
import { UpsertUserDTORequest } from './dto/upsert-user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(BearerAuthGuard)
  @Get('me/favourites/tracks')
  async getMyFavouriteTracks(
    @Request() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const data = await this.userService.getUserFavouriteTracks(
      claims.uid,
      offset,
      limit,
    );
    return data;
  }

  @UseGuards(BearerAuthGuard)
  @Get('me/favourites/albums')
  async getMyFavouriteAlbums(
    @Request() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const data = await this.userService.getUserFavouriteAlbums(
      claims.uid,
      offset,
      limit,
    );
    return data;
  }

  @UseGuards(BearerAuthGuard)
  @Get('me/uploads')
  async getMyUploads(
    @Request() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const data = await this.userService.getUserUploads(
      claims.uid,
      offset,
      limit,
    );
    return data;
  }

  @UseGuards(BearerAuthGuard)
  @Get('me/notifications')
  async getMyNotifications(
    @Request() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 25,
  ): Promise<User> {
    const {
      user: { claims },
    } = req;
    const data = await this.userService.getUserNotifications(
      claims.uid,
      offset,
      limit,
    );
    return data;
  }

  @UseGuards(BearerAuthGuard)
  @Put('me')
  async upsertUserProfile(@Request() req, @Body() upsertUserDTO: UpsertUserDTORequest) : Promise<User>{
    const {
      user: { claims },
    } = req;
    return this.userService.updateOrCreateFavourite(upsertUserDTO, claims.uid);
  }
}