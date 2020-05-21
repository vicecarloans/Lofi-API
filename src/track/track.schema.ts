import * as mongoose from 'mongoose';

export const TrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  upload: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload'
  },
  path: String,
  public: {
    type: Boolean,
    default: true,
  },
  author: String,
  favourites: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  owner: String,
});
