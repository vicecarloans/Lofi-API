import * as mongoose from 'mongoose';

export const AlbumSchema = new mongoose.Schema({
  title: String,
  description: String,
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  public: {
    type: Boolean,
    default: true,
  },
  owner: String,
});
