import { Document } from "mongoose";
import { VoteTypeEnum, VoteSubjectEnum } from "./vote.enum";

export interface IVote extends Document {
  type: VoteTypeEnum;
  owner: string; // Owner of the vote
  subject: VoteSubjectEnum;
  subjectId: string;
}