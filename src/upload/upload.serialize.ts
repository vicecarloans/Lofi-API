import { BaseDBObject } from "src/utils/serializeBase";
import { Track } from "src/track/track.serialize";
import { Image } from "src/image/image.serialize";

export class Upload extends BaseDBObject {
  status: string;
  details: string;
  type: string;
  track: Track;
  image: Image;
  owner: string;

  constructor(partial: Partial<Upload> = {}) {
      super();
      Object.assign(this, partial);
      if(partial.track) this.track = new Track(partial.track)
      if(partial.image) this.image = new Image(partial.image)
  }
}
