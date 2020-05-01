
import { ApiProperty } from '@nestjs/swagger'
import { AlbumResponse } from "src/swagger/responses/album-response.dto";
import { TrackResponse } from "src/swagger/responses/track-response.dto";

export class UserTracksResponse { 
    @ApiProperty({name: "oktaId", type: 'string'})
    readonly oktaId: string;

    @ApiProperty({name: "tracks", type: () => [TrackResponse]})
    tracks: TrackResponse[];
    
}

export class UserAlbumsResponse {
    @ApiProperty({name: "oktaId", type: 'string'})
    readonly oktaId: string;

    @ApiProperty({name: "albums", type: () => [AlbumResponse]})
    albums: AlbumResponse[];
}
