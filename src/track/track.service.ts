import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Track } from './track.interface';
import { CreateTrackDTO } from './dto/create-track.dto';
import { EditTrackDTO } from './dto/edit-track.dto';
import { pickBy } from 'lodash'
import { CloudinaryMediaService } from 'src/cloudinary/media.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel('Track') private readonly trackModel: Model<Track>,
    private cloudinaryMediaService: CloudinaryMediaService,
  ) {}

  async getPublicTracks(offset: number, limit: number): Promise<Track[]> {
    return await this.trackModel
      .find({ public: true })
      .skip(offset)
      .limit(limit);
  }

  async getPrivateTracks(offset: number, limit: number): Promise<Track[]> {
    return await this.trackModel
      .find({ public: false })
      .skip(offset)
      .limit(limit);
  }
  async getPublicTrackById(trackId: string): Promise<Track> {
    return await this.trackModel.findOne({ _id: trackId, public: true });
  }

  async getPrivateTrackById(trackId: string): Promise<Track> {
    return await this.trackModel.findOne({ _id: trackId, public: false });
  }

  async createTrack(createTrackDTO: CreateTrackDTO): Promise<Track> {
    const result = await this.trackModel.create(createTrackDTO);
    this.cloudinaryMediaService.uploadAudio(createTrackDTO.path, result._id);
    return result;
  }

  async editTrack(trackId: string, editTrackDTO: EditTrackDTO): Promise<Track> {
    const fields = pickBy(editTrackDTO, val => val);
    return await this.trackModel.findByIdAndUpdate(
      trackId,
      { $set: fields },
      {
        new: true,
      },
    );
  }

  async deleteTrack(trackId: string) {
    return await this.trackModel.findByIdAndDelete(trackId);
  }
}
