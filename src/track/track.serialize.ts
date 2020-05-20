import { BaseDBObject } from "src/utils/serializeBase";
import { Image } from "src/image/image.serialize";
import { Upload } from "src/upload/upload.serialize";
import { Exclude } from "class-transformer";

export class Track extends BaseDBObject { 
    title: string;
    description: string;
    image: Partial<Image>;
    upload: Partial<Upload>;
    path: string;
    public: boolean;
    owner: string;
    author: string;
    favourites: number;
    upvotes: number;
    downvotes: number;
    @Exclude()
    popularity: number;
    @Exclude()    
    createdAt: Date;
    @Exclude()
    updatedAt: Date;

    constructor(partial: Partial<Track> = {}) {
        super();
        Object.assign(this, partial);
        if(partial.image) this.image = new Image(partial.image);
        if(partial.upload) this.upload = new Upload(partial.upload);
    }
}