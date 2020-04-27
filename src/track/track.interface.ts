import { Document } from 'mongoose'

export interface Track extends Document {
  readonly title: string;
  description: string;
  image: string;
  path: string;
  public: boolean;
  owner: string;
}