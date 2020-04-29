import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpsertUserDTORequest } from './dto/upsert-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUserFavouriteTracks(userId: string, offset, limit): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId })
      .populate('tracks', '-__v -albums -uploads -notifications')
      .skip(offset)
      .limit(limit);
  }

  async getUserFavouriteAlbums(userId: string, offset, limit): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId })
      .populate('albums', '-__v -tracks -uploads -notifications')
      .skip(offset)
      .limit(limit);
  }

  async getUserUploads(userId: string, offset = 0, limit = 25): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId })
      .populate('uploads', '-__v -tracks -albums -notifications')
      .skip(offset)
      .limit(limit);
  }

  async getUserNotifications(userId: string, offset, limit): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId })
      .populate('notifications', '-__v -tracks -albums -uploads')
      .skip(offset)
      .limit(limit);
  }

  async unFavouriteTrack(trackId: string, owner: string): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      { $pull: { tracks: trackId } },
      { new: true },
    );
  }

  async updateOrCreateFavourite(
    upsertUserDTO: UpsertUserDTORequest,
    owner: string,
  ): Promise<User> {
    const { tracks, albums } = upsertUserDTO;
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      {
        $push: {
          tracks: { $each: tracks },
          albums: { $each: albums },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }
}
