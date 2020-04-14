import { Injectable } from "@nestjs/common";
import { User } from "./user.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpsertUserDTORequest } from "./dto/upsert-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUserFavouriteTracks(
    userId: string,
    offset,
    limit,
  ): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId })
      .populate('tracks', '-__v')
      .skip(offset)
      .limit(limit);
  }

  async getUserFavouriteAlbums(
    userId: string,
    offset,
    limit,
  ): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId })
      .populate('albums', '-__v')
      .skip(offset)
      .limit(limit);
  }

  async getUserUploads(userId: string, offset = 0, limit = 25): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId })
      .populate('uploads', '-__v')
      .skip(offset)
      .limit(limit);
  }

  async getUserNotifications(
    userId: string,
    offset,
    limit,
  ): Promise<User>{
    return await this.userModel
                     .findOne({oktaId: userId})
                     .populate("notifications", "-__v")
                     .skip(offset).
                     limit(limit)
  }

  async unFavouriteTrack(upsertUserDTO: UpsertUserDTORequest) : Promise<User>{
    const { oktaId, trackId, albumId } = upsertUserDTO; 
    return await this.userModel.findOneAndUpdate(
      { oktaId: oktaId },
      { $pull: { tracks: trackId, albums: albumId } },
      { new: true }
    );
  }

  async updateOrCreateFavourite(upsertUserDTO: UpsertUserDTORequest): Promise<User> {
    const { oktaId, trackId, albumId } = upsertUserDTO;
    return await this.userModel.findOneAndUpdate(
      { oktaId: oktaId },
      {
        $push: {
          tracks: { $each: [trackId] || [] },
          albums: { $each: [albumId] || [] },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }
}