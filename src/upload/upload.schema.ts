import * as mongoose from 'mongoose';
import { UploadStatusEnum } from './enum/upload-status.enum';

export const UploadSchema = new mongoose.Schema({
  status: {
    type: String,
    default: UploadStatusEnum.PENDING_UPLOAD,
  },
  type: {
    type: String,
    required: true,
  },
  details: String,
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  owner: String,
});
