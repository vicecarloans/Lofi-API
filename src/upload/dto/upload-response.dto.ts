import { ApiProperty, OmitType } from "@nestjs/swagger";
import { TrackResponse } from "src/track/dto/track-response.dto";
import { ImageResponse } from "src/image/dto/image-response.dto";
import { UploadTypeEnum } from "../enum/upload-type.enum";
import { UploadStatusEnum } from "../enum/upload-status.enum";

export class PartialTrackResponse extends OmitType(TrackResponse, ["upload"]){}
export class PartialImageResponse extends OmitType(ImageResponse, ["upload"]){}
export class UploadResponse {
  @ApiProperty({ name: "status", type: "string", enum: UploadStatusEnum })
  status: UploadStatusEnum;
  @ApiProperty({ name: "details", type: "string" })
  details: string;
  @ApiProperty({ name: "type", type: "string", enum: UploadTypeEnum })
  type: UploadTypeEnum;
  @ApiProperty({ name: "track", type: () => PartialTrackResponse})
  track: TrackResponse;
  @ApiProperty({name: "image", type: () => PartialImageResponse})
  image: ImageResponse;
  @ApiProperty({ name: "owner", type: "string" })
  owner: string;
}
