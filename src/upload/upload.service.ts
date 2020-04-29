import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Upload } from './upload.interface';
import { Model } from 'mongoose';
import { EditUploadDTO } from './dto/edit-upload.dto';
import { pickBy } from 'lodash';
import { CreateUploadDTO } from './dto/create-upload.dto';
@Injectable()
export class UploadService {
  constructor(
    @InjectModel('Upload') private readonly uploadModel: Model<Upload>,
  ) {}

  async getUploadInfoById(uploadId: string, owner: string): Promise<Upload> {
    return this.uploadModel.findOne({ _id: uploadId, owner });
  }

  async editUploadData(
    uploadId: string,
    editUploadDTO: EditUploadDTO,
  ): Promise<Upload> {
    const fields = pickBy(editUploadDTO, val => val);
    return this.uploadModel.findByIdAndUpdate(
      uploadId,
      { $set: fields },
      { new: true },
    );
  }

  async createUploadData(
    createUploadDTO: CreateUploadDTO,
    owner: string,
  ): Promise<Upload> {
    return this.uploadModel.create({ ...createUploadDTO, owner });
  }
}
