import { IsOptional } from "class-validator";

export class EditTrackDTO {
    @IsOptional()
    title: string;
    @IsOptional()
    description: string;
    @IsOptional()
    image: string;
    @IsOptional()
    path: string;
}