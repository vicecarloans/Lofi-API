import { IsOptional } from 'class-validator';

export class CreateTrackDTO {
  title: string;
  @IsOptional()
  description: string;
  image: string;
  @IsOptional()
  path: string;
}
