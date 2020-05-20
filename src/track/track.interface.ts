import { Document } from 'mongoose';
import { IImage } from 'src/image/image.interface'
import { IUpload } from "src/upload/upload.interface";

export interface ITrack extends Document {
  readonly title: string;
  description: string;
  image: IImage;
  upload: IUpload;
  path: string;
  public: boolean;
  owner: string;
  author: string;
  favourites: number;
  upvotes: number;
  downvotes: number;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}
