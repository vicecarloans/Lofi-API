import { Document } from 'mongoose';

export interface User extends Document {
    readonly oktaId: string;
    albums: string[];
    tracks: string[];
    uploads: string[];
    notifications: string[];
}