import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDTO {
  @ApiProperty()
  @IsOptional()
  path: string;
}
