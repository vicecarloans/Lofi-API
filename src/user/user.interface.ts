import { Document } from 'mongoose';
import { IAlbum } from 'src/album/album.interface';
import { ITrack } from 'src/track/track.interface';

export interface IUser extends Document {
  readonly oktaId: string;
  albums: IAlbum[];
  tracks: ITrack[];
}
