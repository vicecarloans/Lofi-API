import { VoteTypeEnum } from "src/vote/vote.enum";
import { IsEnum, IsDefined } from "class-validator";

export class AlbumVotingDTO {
  @IsEnum(VoteTypeEnum)
  @IsDefined()
  type: VoteTypeEnum;
}
