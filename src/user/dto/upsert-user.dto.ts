import { IsOptional, IsEnum, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FavouriteCategoriesEnum } from '../enum/favourite-categories';
export class UpsertUserDTORequest {
  @ApiProperty({name: "track", description: "Track Id", type: 'string' })
  @IsOptional()
  trackId: string;

  @ApiProperty({name: "album", description:"Album Id", type: 'string'})
  @IsOptional()
  albumId: string;

  @ApiProperty({name: "category", type: "string", enum: FavouriteCategoriesEnum})
  @IsEnum(FavouriteCategoriesEnum)
  @IsDefined()
  category: FavouriteCategoriesEnum;
}
