import { Document } from 'mongoose';
import { Upload } from 'src/upload/upload.interface';

export interface Image extends Document {
  path: string;
  owner: string;
  public: boolean;
  upload: Upload;
}
