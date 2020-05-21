import { IsOptional, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDTO {
  @ApiProperty({type: "string"})
  @IsDefined()
  title: string;
  @ApiProperty({required: false, type: "string"})
  @IsOptional()
  description: string;
  @ApiProperty({type: "string"})
  image: string;
  @ApiProperty({required: false, type: "string"})
  @IsOptional()
  path: string;
  @ApiProperty({required: true, type: "string"})
  author: string;
}
