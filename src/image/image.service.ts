import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from './image.interface';
import { CloudinaryImageService } from 'src/cloudinary/images.service';
import { Model } from 'mongoose';
import { CreateImageDTO } from './dto/create-image.dto';
import { EditImageDTO } from './dto/edit-image.dto';
import { pickBy, isEmpty } from 'lodash';


@Injectable()
export class ImageService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    private readonly cloudinaryImageService: CloudinaryImageService,
  ) {}

  async getPublicImageById(imageId: string): Promise<Image> {
    return await this.imageModel.findOne({ _id: imageId, public: true });
  }

  async getPrivateImageById(imageId: string): Promise<Image> {
    return await this.imageModel.findOne({ _id: imageId, public: false });
  }

  async createImage(
    createImageDTO: CreateImageDTO,
    owner: string,
  ): Promise<Image> {
    const result = await this.imageModel.create({ ...createImageDTO, owner });
    this.cloudinaryImageService.uploadImage(createImageDTO.path, result._id);
    return result;
  }

  async editImage(
    imageId: string,
    editImageDTO: EditImageDTO,
    owner: string,
  ): Promise<Image  > {
    const fields = pickBy(editImageDTO, val => val);
    if (isEmpty(fields)) {
      throw new UnprocessableEntityException(
        editImageDTO,
        'Update payload should include at least one updatable field',
      );
    }
    const res = await this.imageModel.findOneAndUpdate(
      { _id: imageId, owner },
      { $set: fields },
      { new: true, rawResult: true },
    );

    if (res.value) {
      return res.value;
    } else {
      throw new NotFoundException(
        'No record was found or you might not have permission to update this record',
      );
    }
  }

  async deleteImage(imageId: string, owner: string) {
    const res = await this.imageModel.findOneAndDelete(
      { _id: imageId, owner },
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
