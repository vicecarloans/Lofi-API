import { IsOptional } from 'class-validator'
export class UpsertUserDTORequest {
    oktaId: string;
    @IsOptional()
    trackId: string;
    @IsOptional()
    albumId: string;
}

