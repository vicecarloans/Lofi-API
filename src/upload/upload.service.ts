import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUpload } from "./upload.interface";
import { Model } from 'mongoose';
import { EditUploadDTO } from './dto/edit-upload.dto';
import { pickBy } from 'lodash';
import { CreateUploadDTO } from './dto/create-upload.dto';
import { Upload } from './upload.serialize';
@Injectable()
export class UploadService {
  constructor(
    @InjectModel("Upload") private readonly uploadModel: Model<IUpload>
  ) {}

  async getUploadInfoById(uploadId: string, owner: string): Promise<Upload> {
    const upload = await this.uploadModel.findOne({ _id: uploadId, owner });
    return new Upload(upload.toJSON())
  }

  async editUploadData(
    uploadId: string,
    editUploadDTO: EditUploadDTO
  ): Promise<Upload> {
    const fields = pickBy(editUploadDTO, (val) => val);
    return this.uploadModel.findByIdAndUpdate(
      uploadId,
      { $set: fields },
      { new: true }
    );
  }

  async createUploadData(
    createUploadDTO: CreateUploadDTO,
    owner: string
  ): Promise<Upload> {
    return this.uploadModel.create({ ...createUploadDTO, owner });
  }
}
