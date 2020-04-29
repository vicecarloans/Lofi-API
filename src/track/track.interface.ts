import { Document } from 'mongoose';
import { Image } from 'src/image/image.interface';
import { Upload } from 'src/upload/upload.interface';

export interface Track extends Document {
  readonly title: string;
  description: string;
  image: Image;
  upload: Upload;
  path: string;
  public: boolean;
  owner: string;
}
