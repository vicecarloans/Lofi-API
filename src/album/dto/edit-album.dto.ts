import { IsOptional } from 'class-validator';

export class EditAlbumDTO {
  @IsOptional()
  title: string;
  @IsOptional()
  description: string;
  @IsOptional()
  tracks: string[];
}
