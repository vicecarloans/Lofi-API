import { ApiProperty } from "@nestjs/swagger";
// import { PartialTrackResponse } from "./track-response.dto";
// import { PartialImageResponse } from "./image-response.dto";
import { UploadTypeEnum } from "src/upload/enum/upload-type.enum";
import { UploadStatusEnum } from "src/upload/enum/upload-status.enum";


export class PartialImageResponse {
  @ApiProperty({ name: "path", type: "string" })
  path: string;
  @ApiProperty({ name: "owner", type: "string" })
  owner: string;
  @ApiProperty({ name: "public", type: "boolean" })
  public: boolean;
}

export class PartialTrackResponse {
  @ApiProperty({ name: "title", type: "string" })
  readonly title: string;
  @ApiProperty({ name: "description", type: "string" })
  description: string;
  @ApiProperty({ name: "path", type: "string" })
  path: string;
  @ApiProperty({ name: "public", type: "boolean" })
  public: boolean;
  @ApiProperty({ name: "owner", type: "string" })
  owner: string;
}
export class UploadResponse {
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
  @ApiProperty({ name: "track", type: () => PartialTrackResponse })
  track: PartialTrackResponse;
  @ApiProperty({ name: "image", type: () => PartialImageResponse })
  image: PartialImageResponse;
  @ApiProperty({ name: "owner", type: "string" })
  owner: string;
}

