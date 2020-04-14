import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    oktaId: String,
    albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
    }],
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track"
    }],
    uploads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upload"
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
    }]
}) 