import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Track } from './track.interface';
import { CreateTrackDTO } from './dto/create-track.dto';
import { EditTrackDTO } from './dto/edit-track.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel('Track') private readonly trackModel: Model<Track>,
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
  async getTrackById(trackId: string): Promise<Track> {
    return await this.trackModel.findById(trackId);
  }

  async createTrack(createTrackDTO: CreateTrackDTO): Promise<Track> {
    return await this.trackModel.create(createTrackDTO);
  }

  async editTrack(trackId: string, editTrackDTO: EditTrackDTO): Promise<Track> {
    return await this.trackModel.findByIdAndUpdate(trackId, editTrackDTO, {
      new: true,
    });
  }

  async deleteTrack(trackId: string) {
    return await this.trackModel.findByIdAndDelete(trackId);
  }
}
