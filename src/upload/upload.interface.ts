import { Document } from 'mongoose';
import { ITrack } from 'src/track/track.interface';
import { IImage } from 'src/image/image.interface';

export interface IUpload extends Document {
  status: string;
  details: string;
  type: string;
  track: ITrack;
  image: IImage;
  owner: string;
}
