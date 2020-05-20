import { VoteTypeEnum } from "src/vote/vote.enum";
import { IsEnum } from "class-validator";

export class TrackVotingDTO {
    @IsEnum(VoteTypeEnum)
    type: VoteTypeEnum;
}