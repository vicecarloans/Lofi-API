import { ApiProperty } from "@nestjs/swagger";
import { ImageResponse } from "./image-response.dto";
import { TrackResponse } from "./track-response.dto";

export class AlbumResponse {
  @ApiProperty({ name: "title", type: "string" })
  title: string;
  @ApiProperty({ name: "description", type: "string" })
  description: string;
  @ApiProperty({ name: "tracks", type: () => [TrackResponse] })
  tracks: TrackResponse[];
  @ApiProperty({ name: "image", type: () => ImageResponse })
  image: ImageResponse;
  @ApiProperty({ name: "public", type: "boolean" })
  public: boolean;
  @ApiProperty({ name: "owner", type: "string" })
  owner: string;
  @ApiProperty({ name: "author", type: "string" })
  author: string;
  @ApiProperty({ name: "favourites", type: "number" })
  favourites: number;
  @ApiProperty({ name: "upvotes", type: "number" })
  upvotes: number;
  @ApiProperty({ name: "downvotes", type: "number" })
  downvotes: number;
}
