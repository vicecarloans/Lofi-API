import { IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class AlbumQueries {
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset: number;

    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit: number;
}
