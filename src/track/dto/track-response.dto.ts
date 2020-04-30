import { ImageResponse } from "src/image/dto/image-response.dto";
import { ApiProperty, OmitType} from '@nestjs/swagger'
import { UploadResponse } from "src/upload/dto/upload-response.dto";

export class PartialUploadResponse extends OmitType(UploadResponse, ["image", "track"]) {}
export class PartialImageResponse extends OmitType(ImageResponse, ["upload"]){}

export class TrackResponse {
    @ApiProperty({name: "title", type: "string"})
    readonly title: string;
    @ApiProperty({name: "description", type: "string"})
    description: string;
    @ApiProperty({name: "image", type: () => PartialImageResponse})
    image: ImageResponse;
    @ApiProperty({name: "upload", type: () => PartialUploadResponse})
    upload: UploadResponse;
    @ApiProperty({name: "path", type: "string"})
    path: string;
    @ApiProperty({name: "public", type: "boolean"})
    public: boolean;
    @ApiProperty({name: "owner", type: "string"})
    owner: string;
}
