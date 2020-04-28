import * as mongoose from 'mongoose'

export const TrackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    },
    path: String,
    public: {
        type: Boolean,
        default: true
    },
    owner: String
})