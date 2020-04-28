import { Document } from 'mongoose'


export interface Image extends Document {
    path: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}