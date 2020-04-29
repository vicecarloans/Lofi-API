import { IsOptional } from 'class-validator';

export class EditImageDTO {
  @IsOptional()
  path: string;
}
