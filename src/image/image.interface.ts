import { Document } from 'mongoose';
import { IUpload } from "src/upload/upload.interface";

export interface IImage extends Document {
  path: string;
  owner: string;
  public: boolean;
  upload: IUpload;
}
