import * as mongoose from "mongoose";

export const VoteSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    }, // UPVOTE or DOWNVOTE
    owner: String, // Owner of the vote
    subject: {
        type: String,
        required: true
    }, // TRACK or ALBUM
    subjectId: mongoose.Schema.Types.ObjectId
})