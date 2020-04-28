import { Document } from 'mongoose'
import { Track } from 'src/track/track.interface';
import { Image } from 'src/image/image.interface';

export interface Upload extends Document {
    status: string;
    details: string;
    track: Track;
    image: Image;
    owner: string;
}