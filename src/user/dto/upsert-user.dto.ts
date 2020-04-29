import { IsOptional } from 'class-validator';
export class UpsertUserDTORequest {
  @IsOptional()
  tracks: string[];
  @IsOptional()
  albums: string[];
}
