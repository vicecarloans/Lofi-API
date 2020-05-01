import { Injectable } from "@nestjs/common";
import { User } from "./user.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpsertUserDTORequest } from "./dto/upsert-user.dto";
import { Upload } from "src/upload/upload.interface";
import { Notification } from 'src/notification/notification.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    @InjectModel("Upload") private readonly uploadModel: Model<Upload>,
    @InjectModel("Notification") private readonly notificationModel: Model<Notification>
  ) {}

  async getUserFavouriteTracks(userId: string, offset, limit): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId }, {$unset: "albums"})
      .populate("tracks", "-__v")
      .skip(offset)
      .limit(limit);
  }

  async getUserFavouriteAlbums(userId: string, offset, limit): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId }, { $unset: "tracks" })
      .populate("albums", "-__v -tracks")
      .skip(offset)
      .limit(limit);
  }

  async getUserUploads(userId: string, offset = 0, limit = 25): Promise<Upload[]> {
    return await this.uploadModel
      .find({ owner: userId })
      .skip(offset)
      .limit(limit);
  }

  async getUserNotifications(userId: string, offset, limit): Promise<Notification[]> {
    return await this.notificationModel
      .find({ owner: userId })
      .skip(offset)
      .limit(limit);
  }

  async unFavouriteTrack(trackId: string, owner: string): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      { $pull: { tracks: trackId } },
      { new: true }
    );
  }

  async updateOrCreateFavourite(
    upsertUserDTO: UpsertUserDTORequest,
    owner: string
  ): Promise<User> {
    const { tracks, albums } = upsertUserDTO;
    console.log(tracks);
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      {
        $addToSet: {
          tracks: { $each: tracks || [] },
          albums: { $each: albums || [] },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  }
}
