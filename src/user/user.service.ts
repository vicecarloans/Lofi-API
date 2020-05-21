import { Injectable } from "@nestjs/common";
import { IUser } from "./user.interface";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IUpload } from "src/upload/upload.interface";
import { INotification } from "src/notification/notification.interface";
import { Notification } from "src/notification/notification.serialize";
import { Upload } from "src/upload/upload.serialize";
import { User } from "./user.serialize";
import { ITrack } from "src/track/track.interface";
import { IAlbum } from "src/album/album.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<IUser>,
    @InjectModel("Upload") private readonly uploadModel: Model<IUpload>,
    @InjectModel("Notification")
    private readonly notificationModel: Model<INotification>,
    @InjectModel("Track") private readonly trackModel: Model<ITrack>,
    @InjectModel("Album") private readonly albumModel: Model<IAlbum>
  ) {}

  async getUserFavouriteTracks(userId: string, offset, limit): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId }, { $unset: ["albums", "_id"] })
      .populate({
        path: "tracks",
        select: "-__v",
        populate: [
          { path: "image", select: "-__v -upload" },
          { path: "upload", select: "-__v -track -image" },
        ],
      })
      .skip(offset)
      .limit(limit);
  }

  async getUserFavouriteAlbums(userId: string, offset, limit): Promise<User> {
    return await this.userModel
      .findOne({ oktaId: userId }, { $unset: ["tracks", "_id"] })
      .populate({
        path: "albums",
        select: "-__v",
        populate: [
          {
            path: "tracks",
            select: "-__v",
            populate: [
              { path: "image", select: "-__v -upload" },
              { path: "upload", select: "-__v -track -image" },
            ],
          },
          {
            path: "image",
            select: "-__v",
            populate: { path: "upload", select: "-__v -track -image" },
          },
        ],
      })
      .skip(offset)
      .limit(limit);
  }

  async getUserUploads(
    userId: string,
    offset = 0,
    limit = 25
  ): Promise<Upload[]> {
    const uploads = await this.uploadModel
      .find({ owner: userId })
      .skip(offset)
      .limit(limit);
    return uploads.map((upload) => new Upload(upload.toJSON()));
  }

  async getUserNotifications(
    userId: string,
    offset,
    limit
  ): Promise<Notification[]> {
    return await this.notificationModel
      .find({ owner: userId })
      .skip(offset)
      .limit(limit);
  }

  /*** Create User Profile ***/
  async createProfile(owner: string): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      {
        $set: {
          oktaId: owner,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
  /*** Track Favourites ***/
  async _unFavouriteTrack(trackId: string, owner: string): Promise<User> {
    await this.trackModel.findByIdAndUpdate(trackId, {
      $inc: { favourites: -1 },
    });
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      { $pull: { tracks: trackId } },
      { new: true }
    );
  }

  async _favouriteTrack(trackId: string, owner: string): Promise<User> {
    await this.trackModel.findByIdAndUpdate(trackId, {
      $inc: { favourites: 1 },
    });
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      { $addToSet: { tracks: trackId } },
      { new: true, upsert: true }
    );
  }

  async updateOrCreateFavouriteTrack(
    trackId: string,
    owner: string
  ): Promise<User> {
    const profile = await this.userModel.findOne({
      oktaId: owner,
      tracks: { $elemMatch: { $eq: trackId } },
    });
    if (profile) {
      // If Track already favourited by user
      return await this._unFavouriteTrack(trackId, owner);
    }

    return await this._favouriteTrack(trackId, owner);
  }

  /*** Album Favourites ***/
  async _unFavouriteAlbum(albumId: string, owner: string): Promise<User> {
    await this.albumModel.findByIdAndUpdate(albumId, {
      $inc: { favourites: -1 },
    });
    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      { $pull: { albums: albumId } },
      { new: true }
    );
  }

  async _favouriteAlbum(albumId: string, owner: string): Promise<User> {
    await this.albumModel.findByIdAndUpdate(albumId, {
      $inc: { favourites: 1 },
    });

    return await this.userModel.findOneAndUpdate(
      { oktaId: owner },
      { $addToSet: { albums: albumId } },
      { new: true, upsert: true }
    );
  }

  async updateOrCreateFavouriteAlbum(
    albumId: string,
    owner: string
  ): Promise<User> {
    const profile = await this.userModel.findOne({
      oktaId: owner,
      albums: { $elemMatch: { $eq: albumId } },
    });

    if (profile) {
      // If Track already favourited by user
      return await this._unFavouriteAlbum(albumId, owner);
    }

    return await this._favouriteAlbum(albumId, owner);
  }
}
