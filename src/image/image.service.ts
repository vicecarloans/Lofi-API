import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IImage } from './image.interface';
import { Image } from './image.serialize'
import { Model } from 'mongoose';
import { CreateImageDTO } from './dto/create-image.dto';
import { EditImageDTO } from './dto/edit-image.dto';
import { pickBy, isEmpty } from 'lodash';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateUploadDTO } from 'src/upload/dto/create-upload.dto';
import { UploadTypeEnum } from 'src/upload/enum/upload-type.enum';
import { IUpload } from "src/upload/upload.interface";

@Injectable()
export class ImageService {
  constructor(
    @InjectModel("Image") private readonly imageModel: Model<IImage>,
    @InjectModel("Upload") private readonly uploadModel: Model<IUpload>,
    @InjectQueue("image") private readonly imageQueue: Queue
  ) {}

  async getPublicImageById(imageId: string): Promise<Image> {
    return await this.imageModel
      .findOne({ _id: imageId, public: true })
      .populate("upload", "-__v -track -image");
  }

  async getPrivateImageById(imageId: string): Promise<Image> {
    return await this.imageModel
      .findOne({ _id: imageId, public: false })
      .populate("upload", "-__v -track -image");
  }

  async createImage(
    createImageDTO: CreateImageDTO,
    owner: string
  ): Promise<Image> {
    const uploadDTO = new CreateUploadDTO("", UploadTypeEnum.IMAGE);
    const upload = await this.uploadModel.create({ ...uploadDTO, owner });
    const image = await this.imageModel.create({
      ...createImageDTO,
      owner,
      upload: upload._id,
    });

    await this.imageQueue.add(
      "upload",
      { path: createImageDTO.path, imageId: image._id },
      { jobId: upload._id, attempts: 10 }
    );
    return image;
  }

  async editImage(
    imageId: string,
    editImageDTO: EditImageDTO,
    owner: string
  ): Promise<Image> {
    const fields = pickBy(editImageDTO, (val) => val);
    if (isEmpty(fields)) {
      throw new UnprocessableEntityException(
        editImageDTO,
        "Update payload should include at least one updatable field"
      );
    }
    const res = await this.imageModel.findOneAndUpdate(
      { _id: imageId, owner },
      { $set: fields },
      { new: true, rawResult: true }
    );

    if (res.value) {
      return res.value;
    } else {
      throw new NotFoundException(
        "No record was found or you might not have permission to update this record"
      );
    }
  }

  async deleteImage(imageId: string, owner: string) {
    const res = await this.imageModel.findOneAndDelete(
      { _id: imageId, owner },
      { rawResult: true }
    );
    if (res.value) {
      return res.value;
    } else {
      throw new NotFoundException(
        "No record was found or you might not have permission to update this record"
      );
    }
  }
}
