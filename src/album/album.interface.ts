import { Document } from 'mongoose';
import { Track } from 'src/track/track.interface';
import { Image } from 'src/image/image.interface';

export interface Album extends Document {
  title: string;
  description: string;
  tracks: Track[];
  image: Image;
  public: boolean;
}
