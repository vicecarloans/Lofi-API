import { VoteTypeEnum } from "src/vote/vote.enum";
import { IsEnum, IsDefined } from "class-validator";

export class TrackVotingDTO {
    @IsEnum(VoteTypeEnum)
    @IsDefined()
    type: VoteTypeEnum;
}