import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Track } from './track.interface';
import { CreateTrackDTO } from './dto/create-track.dto';
import { EditTrackDTO } from './dto/edit-track.dto';
import { pickBy } from 'lodash';
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

  async createTrack(
    createTrackDTO: CreateTrackDTO,
    owner: string,
  ): Promise<Track> {
    const result = await this.trackModel.create({ ...createTrackDTO, owner });
    this.cloudinaryMediaService.uploadAudio(createTrackDTO.path, result._id);
    return result;
  }

  async editTrack(
    trackId: string,
    editTrackDTO: EditTrackDTO,
    owner: string,
  ): Promise<Track> {
    const fields = pickBy(editTrackDTO, val => val);
    const res = await this.trackModel.findOneAndUpdate(
      { _id: trackId, owner },
      { $set: fields },
      {
        new: true,
        rawResult: true,
      },
    );
    if (res.value) {
      return res.value;
    } else {
      throw new NotFoundException(
        'No record was found or you might not have permission to update this record',
      );
    }
  }

  async deleteTrack(trackId: string, owner: string) {
    const res = await this.trackModel.findOneAndDelete(
      { _id: trackId, owner },
      { rawResult: true },
    );
    if (res.value) {
      return res.value;
    } else {
      throw new NotFoundException(
        'No record was found or you might not have permission to update this record',
      );
    }
  }
}
