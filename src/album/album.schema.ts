import * as mongoose from "mongoose";

export const AlbumSchema = new mongoose.Schema({
  title: String,
  description: String,
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  public: {
    type: Boolean,
    default: true,
  },
  author: String,
  favourites: {
    type: Number,
    default: 0,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  owner: String,
});
