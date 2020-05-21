import { IsMongoId } from "class-validator";

export class VoteParams {
    @IsMongoId()
    subjectId: string;
}