import { ImageResponse } from "./image-response.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UploadStatusEnum } from "src/upload/enum/upload-status.enum";
import { UploadTypeEnum } from "src/upload/enum/upload-type.enum";

export class PartialImageResponse extends OmitType(ImageResponse, ["upload"]) {}


export class PartialUploadResponse {
  @ApiProperty({
    name: "status",
    type: "string",
    enum: UploadStatusEnum,
  })
  status: UploadStatusEnum;
  @ApiProperty({ name: "details", type: "string" })
  details: string;
  @ApiProperty({ name: "type", type: "string", enum: UploadTypeEnum })
  type: UploadTypeEnum;
  @ApiProperty({ name: "owner", type: "string" })
  owner: string;
}
export class TrackResponse {
    @ApiProperty({ name: "title", type: "string" })
    readonly title: string;
    @ApiProperty({ name: "description", type: "string" })
    description: string;
    @ApiProperty({ name: "image", type: () => PartialImageResponse })
    image: ImageResponse;
    @ApiProperty({ name: "upload", type: PartialUploadResponse })
    upload: PartialUploadResponse;
    @ApiProperty({ name: "path", type: "string" })
    path: string;
    @ApiProperty({ name: "public", type: "boolean" })
    public: boolean;
    @ApiProperty({ name: "owner", type: "string" })
    owner: string;
}

