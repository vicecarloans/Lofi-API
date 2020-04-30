import { IsMongoId } from "class-validator";

export class AlbumParams {
  @IsMongoId()
  id: string;
}
