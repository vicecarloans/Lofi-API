import { Document } from 'mongoose';
import { ITrack } from 'src/track/track.interface';
import { IImage } from 'src/image/image.interface';

export interface IAlbum extends Document {
  title: string;
  description: string;
  tracks: ITrack[];
  image: IImage;
  public: boolean;
}
