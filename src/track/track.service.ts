import { Model } from "mongoose";
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { ITrack } from "./track.interface";
import { CreateTrackDTO } from "./dto/create-track.dto";
import { EditTrackDTO } from "./dto/edit-track.dto";
import { pickBy, isEmpty } from "lodash";
import { CreateUploadDTO } from "src/upload/dto/create-upload.dto";
import { UploadTypeEnum } from "src/upload/enum/upload-type.enum";
import { IUpload } from "src/upload/upload.interface";
import { Track } from "./track.serialize";
import { IVote } from "src/vote/vote.interface";
import { VoteTypeEnum, VoteSubjectEnum } from "src/vote/vote.enum";
import { wilsonScore } from "src/utils/wilsonScore";

const popularityCalc = wilsonScore(null);
@Injectable()
export class TrackService {
  constructor(
    @InjectModel("Track") private readonly trackModel: Model<ITrack>,
    @InjectModel("Upload") private readonly uploadModel: Model<IUpload>,
    @InjectModel("Vote") private readonly voteModel: Model<IVote>,
    @InjectQueue("audio") private readonly audioQueue: Queue
  ) {}

  // GET
  // -- Public Recently Added Track
  async getPublicTracks(offset: number, limit: number): Promise<Track[]> {
    return await this.trackModel
      .find({ public: true })
      .populate("image", "-__v -upload")
      .populate("upload", "-__v -track -image")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  }

  // -- Private Recently Added Track
  async getPrivateTracks(offset: number, limit: number): Promise<Track[]> {
    const tracks = await this.trackModel
      .find({ public: false })
      .populate("image", "-__v")
      .populate("upload", "-__v -track -image")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    return tracks.map((track) => new Track(track.toJSON()));
  }

  // -- Public Popular Track
  async getPublicPopularTrack(offset: number, limit: number): Promise<Track[]> {
    return await this.trackModel
      .find({ public: true })
      .populate("image", "-__v -upload")
      .populate("upload", "-__v -track -image")
      .sort({ popularity: -1 })
      .skip(offset)
      .limit(limit);
  }

  // -- Private Popular Track
  async getPrivatePopularTrack(offset: number, limit: number): Promise<Track[]> {
    return await this.trackModel
      .find({ public: false })
      .populate("image", "-__v -upload")
      .populate("upload", "-__v -track -image")
      .sort({ popularity: -1 })
      .skip(offset)
      .limit(limit);
  }

  // -- Public Track By Id
  async getPublicTrackById(trackId: string): Promise<Track> {
    return await this.trackModel
      .findOne({ _id: trackId, public: true })
      .populate("upload", "-__v -track -image")
      .populate("image", "-__v");
  }

  // -- Private Track By Id
  async getPrivateTrackById(trackId: string): Promise<Track> {
    return await this.trackModel
      .findOne({ _id: trackId, public: false })
      .populate("upload", "-__v -track -image")
      .populate("image", "-__v");
  }

  // POST
  async createTrack(
    createTrackDTO: CreateTrackDTO,
    owner: string
  ): Promise<Track> {
    const uploadDTO = new CreateUploadDTO("", UploadTypeEnum.TRACK);
    const upload = await this.uploadModel.create({ ...uploadDTO, owner });
    const track = await this.trackModel.create({
      ...createTrackDTO,
      owner,
      upload: upload._id,
    });
    await this.audioQueue.add(
      "upload",
      {
        path: createTrackDTO.path,
        trackId: track._id,
      },
      {
        jobId: upload._id,
      }
    );
    return track;
  }

  // PUT
  // - Edit Track
  async editTrack(
    trackId: string,
    editTrackDTO: EditTrackDTO,
    owner: string
  ): Promise<Track> {
    const fields = pickBy(editTrackDTO, (val) => val);
    if (isEmpty(fields)) {
      throw new UnprocessableEntityException(
        editTrackDTO,
        "Update payload should include at least one updatable field"
      );
    }
    
    const res = await this.trackModel.findOneAndUpdate(
      { _id: trackId, owner },
      { $set: fields, updatedAt: Date.now() },
      {
        new: true,
        rawResult: true,
      }
    );

    if (res.value) {
      return res.value;
    } else {
      throw new NotFoundException(
        "No record was found or you might not have permission to update this record"
      );
    }
  }

  // - Upvote Track

  async upvoteTrack(trackId: string, owner: string) {
    let shouldVote = true;
    // Find Vote Record
    const vote = await this.voteModel.findOne({ owner, subjectId: trackId });

    if (vote && vote.type === VoteTypeEnum.UPVOTE) {
      shouldVote = false;
    }

    if (shouldVote) {
      // Action is Add/Delete Vote
      const result = await this.voteModel.findOneAndUpdate(
        { owner, subjectId: trackId },
        {
          $set: {
            type: VoteTypeEnum.UPVOTE,
            owner,
            subject: VoteSubjectEnum.TRACK,
            subjectId: trackId,
          },
        },
        { upsert: true, rawResult: true }
      );
      const track = await this.trackModel.findById(trackId);
      if (result.lastErrorObject.updatedExisting) {
        // If vote action was update

        const score = popularityCalc(track.upvotes + 1, track.downvotes - 1);
        await track.updateOne({
          $inc: { upvotes: 1, downvotes: -1 },
          $set: { popularity: score },
          updatedAt: Date.now(),
        });
      } else {
        // If vote action was insert

        const score = popularityCalc(track.upvotes + 1, track.downvotes);
        await track.updateOne({
          $inc: { upvotes: 1 },
          $set: { popularity: score },
          updatedAt: Date.now()
        });
      }
    } else {
      // Action is Unvote
      await vote.remove();

      const track = await this.trackModel.findById(trackId);
      const score = popularityCalc(track.upvotes - 1, track.downvotes);
      await track.updateOne({
        $inc: { upvotes: -1 },
        $set: { popularity: score },
        updatedAt: Date.now(),
      });
    }
  }

  // - Downvote Track
  async downvoteTrack(trackId: string, owner: string) {
    let shouldVote = true;
    // Find Vote Record
    const vote = await this.voteModel.findOne({ owner, subjectId: trackId });

    if (vote && vote.type === VoteTypeEnum.DOWNVOTE) {
      shouldVote = false;
    }

    if (shouldVote) {
      // Action is Add/Delete Vote
      const result = await this.voteModel.findOneAndUpdate(
        { owner, subjectId: trackId },
        {
          $set: {
            type: VoteTypeEnum.DOWNVOTE,
            owner,
            subject: VoteSubjectEnum.TRACK,
            subjectId: trackId,
          },
        },
        { upsert: true, rawResult: true }
      );
      const track = await this.trackModel.findById(trackId);
      if (result.lastErrorObject.updatedExisting) {
        // If vote action was update

        const score = popularityCalc(track.upvotes - 1, track.downvotes + 1);
        await track.updateOne({
          $inc: { upvotes: -1, downvotes: 1 },
          $set: { popularity: score },
          updatedAt: Date.now(),
        });
      } else {
        // If vote action was insert

        const score = popularityCalc(track.upvotes, track.downvotes + 1);
        await track.updateOne({
          $inc: { downvotes: 1 },
          $set: { popularity: score },
          updatedAt: Date.now(),
        });
      }
    } else {
      // Action is Unvote
      await vote.remove();

      const track = await this.trackModel.findById(trackId);
      const score = popularityCalc(track.upvotes, track.downvotes - 1);
      await track.updateOne({
        $inc: { downvotes: -1 },
        $set: { popularity: score },
        updatedAt: Date.now(),
      });
    }
  }

  //DELETE
  async deleteTrack(trackId: string, owner: string) {
    const res = await this.trackModel.findOneAndDelete(
      { _id: trackId, owner },
      { rawResult: true }
    );
    if (res.value) {
      return res.value;
    } else {
      throw new NotFoundException(
        "No record was found or you might not have permission to update this record"
      );
    }
  }
}
