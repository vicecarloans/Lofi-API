import * as mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema({
  path: String,
  owner: String,
  upload: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Upload"
  },
  public: {
    type: Boolean,
    default: true,
  },
});
