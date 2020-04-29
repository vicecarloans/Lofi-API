import { IsOptional, IsMongoId } from 'class-validator';

export class CreateAlbumDTO {
  title: string;
  description: string;
  @IsOptional()
  tracks: string[];
  @IsMongoId()
  image: string;
}
