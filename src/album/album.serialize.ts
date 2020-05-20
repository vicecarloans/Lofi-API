import { BaseDBObject } from "src/utils/serializeBase";
import { Track } from "src/track/track.serialize";
import { Image } from "src/image/image.serialize";

export class Album extends BaseDBObject {
  title: string;
  description: string;
  tracks: Track[];
  image: Image;
  public: boolean;

  constructor(partial : Partial<Album> = {}) {
      super();
      Object.assign(this, partial);
      if(partial.tracks) this.tracks = partial.tracks.map(track => new Track(track));
      if(partial.image) this.image = new Image(partial.image)
  }
}
