import { ApiProperty } from '@nestjs/swagger';

export class ImageResponse {
    @ApiProperty({name: "path", type: "string"})
    path: string;
    @ApiProperty({name: "owner", type: "string"})
    owner: string;
    @ApiProperty({name: "public", type: "boolean"})
    public: boolean;
}
