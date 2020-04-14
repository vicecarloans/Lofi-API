import * as mongoose from 'mongoose'

export const TrackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: String,
    path: String,
    public: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})