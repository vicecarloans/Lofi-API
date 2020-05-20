import { VoteTypeEnum, VoteSubjectEnum } from "src/vote/vote.enum";
import { ApiProperty } from "@nestjs/swagger";

export class VoteResponse {
  @ApiProperty({ name: "type", type: "string", enum: VoteTypeEnum })
  type: VoteTypeEnum;
  @ApiProperty({name: "owner", type: "string"})
  owner: string;
  @ApiProperty({name: "subject", type: "string", enum: VoteSubjectEnum})
  subject: VoteSubjectEnum;
  @ApiProperty({name: "subjectId", type: "string"})
  subjectId: string;
}
