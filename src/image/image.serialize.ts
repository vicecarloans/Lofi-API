import { BaseDBObject } from "src/utils/serializeBase";
import { Upload } from "src/upload/upload.serialize";

export class Image extends BaseDBObject {
    path: string;
    owner: string;
    public: boolean;
    upload: Upload;

    constructor(partial: Partial<Image> = {}) {
        super();
        Object.assign(this, partial)
        if(partial.upload) this.upload = new Upload(partial.upload)
    }
}