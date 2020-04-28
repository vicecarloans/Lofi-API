import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from './album.interface';
import { Model } from 'mongoose';
import { CreateAlbumDTO } from './dto/create-album.dto';
import { EditAlbumDTO } from './dto/edit-album.dto';
import { pickBy, isEmpty, omit } from 'lodash';
@Injectable()
export class AlbumService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
  ) {}

  async getPublicAlbums(offset: number, limit: number): Promise<Album[]> {
    return await this.albumModel
      .find({ public: true })
      .populate('tracks', '-_id -__v')
      .populate('image', '-_id -__v')
      .skip(offset)
      .limit(limit);
  }

  async getPrivateAlbums(offset: number, limit: number): Promise<Album[]> {
    return await this.albumModel
      .find({ public: false })
      .populate('tracks', '-_id -__v')
      .populate('image', '-_id -__v')
      .skip(offset)
      .limit(limit);
  }
  async getPublicAlbumById(albumId: string): Promise<Album> {
    return await this.albumModel
      .findOne({ _id: albumId, public: true })
      .populate('tracks', '-_id -__v')
      .populate('image', '-_id -__v');
  }

  async getPrivateAlbumById(albumId: string): Promise<Album> {
    return await this.albumModel
      .findOne({ _id: albumId, public: false })
      .populate('tracks', '-_id -__v')
      .populate('image', '-_id -__v');
  }

  async createAlbum(
    createAlbumDTO: CreateAlbumDTO,
    owner: string,
  ): Promise<Album> {
    const result = await this.albumModel.create({ ...createAlbumDTO, owner });
    return result;
  }

  async editAlbum(
    albumId: string,
    editAlbumDTO: EditAlbumDTO,
    owner: string,
  ): Promise<Album> {
    const fields = pickBy(omit(editAlbumDTO, "tracks"), val => val);
    if (isEmpty(fields)) {
      throw new BadRequestException(
        editAlbumDTO,
        'Update payload should include at least one updatable field',
      );
    }
    const res = await this.albumModel.findOneAndUpdate(
      { _id: albumId, owner },
      { $set: fields, $push: { tracks: { $each: editAlbumDTO.tracks } } },
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

  async deleteAlbum(albumId: string, owner: string) {
    const res = await this.albumModel.findOneAndDelete(
      { _id: albumId, owner },
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
