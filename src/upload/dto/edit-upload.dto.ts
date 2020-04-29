import { ValidateIf, IsDefined } from 'class-validator';
import { UploadStatusEnum } from '../enum/upload-status.enum';

export class EditUploadDTO {
  @ValidateIf(o => o.status === UploadStatusEnum.REJECTED)
  @IsDefined()
  details: string;

  status: UploadStatusEnum;
}
