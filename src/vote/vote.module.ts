import { VoteService } from "./vote.service";
import { VoteController } from "./vote.controller";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VoteSchema } from "./vote.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: "Vote", schema: VoteSchema}])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
