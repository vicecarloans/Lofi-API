import { IsMongoId } from "class-validator";

export class TrackParams {
  @IsMongoId()
  id: string;
}
