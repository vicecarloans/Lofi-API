import { Document } from 'mongoose';
import { Album } from 'src/album/album.interface';
import { Track } from 'src/track/track.interface';

export interface User extends Document {
  readonly oktaId: string;
  albums: Album[];
  tracks: Track[];
}
