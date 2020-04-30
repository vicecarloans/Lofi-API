import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UploadResponse } from "src/upload/dto/upload-response.dto";

export class PartialUploadResponse extends OmitType(UploadResponse, ["track", "image"]){}

export class ImageResponse {
  @ApiProperty({ name: "path", type: "string" })
  path: string;
  @ApiProperty({ name: "owner", type: "string" })
  owner: string;
  @ApiProperty({ name: "public", type: "boolean" })
  public: boolean;
  @ApiProperty({name: "upload", type: () => PartialUploadResponse})
  upload: UploadResponse;
}
