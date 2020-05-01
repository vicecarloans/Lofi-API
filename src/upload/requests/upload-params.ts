import { IsMongoId } from "class-validator";

export class UploadEndpointParams {
  @IsMongoId()
  id: string;
}