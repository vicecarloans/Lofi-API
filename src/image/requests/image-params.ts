import { IsMongoId } from "class-validator";

export class ImageParams {
  @IsMongoId()
  id: string;
}
