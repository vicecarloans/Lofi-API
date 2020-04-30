import { ApiProperty } from "@nestjs/swagger";

export class TrackUploadDTO {
  @ApiProperty({ type: "string", format: "binary" })
  audio: any;
}
