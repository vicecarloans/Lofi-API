import { BaseDBObject } from "src/utils/serializeBase";
import { VoteTypeEnum, VoteSubjectEnum } from "./vote.enum";

export class Vote extends BaseDBObject {
  type: VoteTypeEnum;
  owner: string;
  subject: VoteSubjectEnum;
  subjectId: string;

  constructor(partial: Partial<Vote> = {}) {
      super();
      Object.assign(this, partial);
  }
}
