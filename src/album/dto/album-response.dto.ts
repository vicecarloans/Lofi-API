import { ApiProperty } from '@nestjs/swagger';
import { ImageResponse } from 'src/image/dto/image-response.dto';
import { TrackResponse } from 'src/track/dto/track-response.dto';

export class AlbumResponse {
    @ApiProperty({name: "title", type: "string"})
    title: string;
    @ApiProperty({name: "description", type: "string"})
    description: string;
    @ApiProperty({name: "tracks", type: () => [TrackResponse]})
    tracks: TrackResponse[];
    @ApiProperty({name: "image", type: () => ImageResponse})
    image: ImageResponse;
    @ApiProperty({name: "public", type: "boolean"})
    public: boolean;
}
