import { IsOptional } from 'class-validator';
import { Track } from 'src/track/track.interface';
import { Album } from 'src/album/album.interface';
import { ApiProperty } from '@nestjs/swagger';
export class UpsertUserDTORequest {
  @ApiProperty({name: "tracks", description: "Track Ids", type: 'array', items: {type: 'string'}})
  @IsOptional()
  tracks: string[];

  @ApiProperty({name: "albums", description:"Album Ids", type: 'array', items: {type: 'string'}})
  @IsOptional()
  albums: string[];
}
