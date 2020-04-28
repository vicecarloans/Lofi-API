import * as mongoose from 'mongoose'

export const ImageSchema = new mongoose.Schema({
    path: String,
    owner: String
})