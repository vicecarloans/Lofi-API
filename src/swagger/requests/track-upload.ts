import { IntersectionType, OmitType } from "@nestjs/swagger";
import { CreateTrackDTO } from "src/track/dto/create-track.dto";
import { TrackUploadDTO } from "src/track/dto/track-upload.dto";

export class TrackUploadRequest extends IntersectionType(OmitType(CreateTrackDTO, ["path"]), TrackUploadDTO) {}