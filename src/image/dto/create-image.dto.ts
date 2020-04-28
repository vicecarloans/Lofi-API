import { IsOptional } from 'class-validator'

export class CreateImageDTO{
    @IsOptional()
    path: string;
}
