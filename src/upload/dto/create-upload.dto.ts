import { UploadTypeEnum } from '../enum/upload-type.enum';

export class CreateUploadDTO {
  details: string;
  type: UploadTypeEnum;

  constructor(details, type) {
    this.details = details;
    this.type = type;
  }
}
