import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IVote } from './vote.interface';
import { Model } from "mongoose";
import { Vote } from './vote.serialize';

@Injectable()
export class VoteService {
    constructor(
        @InjectModel("Vote") private readonly voteModel: Model<IVote>
    ){}
    
    async getVote(owner: string, subjectId: string): Promise<Vote> {
        return await this.voteModel.findOne({owner, subjectId})
    }
}
