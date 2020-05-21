import { Controller, Get, UseGuards, Param, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiOkResponse } from "@nestjs/swagger";
import { VoteService } from "./vote.service";
import { BearerAuthGuard } from "src/auth/bearer-auth.guard";
import { VoteParams } from "./requests/vote-params";
import { Vote } from "./vote.serialize";
import { VoteResponse } from "src/swagger/responses/vote-response.dto";
import { omit } from 'lodash'
@ApiTags("Vote Endpoints")
@Controller("vote")
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiOperation({summary: "Get Vote By Owner and Subject"})
  @ApiParam({name: "subjectId"})
  @ApiOkResponse({
    description: "Vote Found",
    type: VoteResponse
  })
  @ApiBearerAuth()
  @UseGuards(BearerAuthGuard)
  @Get(":subjectId")
  async getVote(@Request() req, @Param() params: VoteParams) {
    const {
      user: { claims },
    } = req;
    const { subjectId } = params;
    const vote = await this.voteService.getVote(claims.uid, subjectId);
    return new Vote(omit(vote.toJSON(), ["subjectId"]));
  }
}
