import { BaseDBObject } from "src/utils/serializeBase";
import { Album } from "src/album/album.serialize";
import { Track } from "src/track/track.serialize";

export class User extends BaseDBObject {
  oktaId: string;
  albums: Album[];
  tracks: Track[];

  constructor(partial: Partial<User> = {}) {
      super();
      Object.assign(this, partial);
      if(partial.albums) this.albums = partial.albums.map(album => new Album(album));
      if(partial.tracks) this.tracks = partial.tracks.map(track => new Track(track));
  }
}
