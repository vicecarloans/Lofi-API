
import { Upload } from "src/upload/upload.interface";
import { ApiProperty } from '@nestjs/swagger'
import { AlbumResponse } from "src/album/dto/album-response.dto";
import { TrackResponse } from "src/track/dto/track-response.dto";
import { UploadResponse } from "src/upload/dto/upload-response.dto";
import { NotificationResponse } from "src/notification/dto/notification-response.dto";

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

export class UserUploadsReponse{
    @ApiProperty({name: "oktaId", type: 'string'})
    readonly oktaId: string;

    @ApiProperty({name: "uploads", type: () => [UploadResponse]})
    uploads: Upload[];
}

export class UserNotificationsResponse {
    @ApiProperty({name: "oktaId", type: 'string'})
    readonly oktaId: string;

    @ApiProperty({name: "notifications", type: () => [NotificationResponse]})
    notifications: Notification[];
}