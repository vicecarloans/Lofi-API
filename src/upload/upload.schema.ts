import * as mongoose from 'mongoose'
export const UploadSchema = new mongoose.Schema({
    status: String,
    details: String,
    track: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track"
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    },
    owner: String
})