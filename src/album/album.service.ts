import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IAlbum } from "./album.interface";
import { Model } from "mongoose";
import { CreateAlbumDTO } from "./dto/create-album.dto";
import { EditAlbumDTO } from "./dto/edit-album.dto";
import { pickBy, isEmpty, omit } from "lodash";
import { Album } from "./album.serialize";
import { VoteTypeEnum, VoteSubjectEnum } from "src/vote/vote.enum";
import { wilsonScore } from "src/utils/wilsonScore";
import { IVote } from "src/vote/vote.interface";
import { AlbumCollection } from "./response/album-many";

const popularityCalc = wilsonScore(null);

@Injectable()
export class AlbumService {
    constructor(
        @InjectModel("Album") private readonly albumModel: Model<IAlbum>,
        @InjectModel("Vote") private readonly voteModel: Model<IVote>
    ) {}

    // GET
    // -- Public Recently Added Album
    async getPublicAlbums(
        offset: number,
        limit: number
    ): Promise<AlbumCollection> {
        const albums = await this.albumModel
            .find({ public: true })
            .populate({
                path: "tracks",
                select: "-__v -upload",
                populate: { path: "image", select: "-__v -upload" },
            })
            .populate("image", "-__v -upload")
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        const count = await this.albumModel
            .find({ public: true })
            .estimatedDocumentCount();

        return { items: albums, count };
    }

    // -- Private Recently Added Album
    async getPrivateAlbums(
        offset: number,
        limit: number
    ): Promise<AlbumCollection> {
        const albums = await this.albumModel
            .find({ public: false })
            .populate({
                path: "tracks",
                select: "-__v -upload",
                populate: { path: "image", select: "-__v -upload" },
            })
            .populate("image", "-__v -upload")
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);
        const count = await this.albumModel
            .find({ public: false })
            .estimatedDocumentCount();
        return { items: albums, count };
    }

    // -- Public Album By Id
    async getPublicAlbumById(albumId: string): Promise<Album> {
        return await this.albumModel
            .findOne({ _id: albumId, public: true })
            .populate({
                path: "tracks",
                select: "-__v -upload",
                populate: { path: "image", select: "-__v -upload" },
            })
            .populate("tracks.image", "-__v -upload")
            .populate("image", "-__v -upload");
    }

    // -- Private Album By Id
    async getPrivateAlbumById(albumId: string): Promise<Album> {
        return await this.albumModel
            .findOne({ _id: albumId, public: false })
            .populate({
                path: "tracks",
                select: "-__v -upload",
                populate: { path: "image", select: "-__v -upload" },
            })
            .populate("tracks.image", "-__v -upload")
            .populate("image", "-__v -upload");
    }

    // -- Public Popular Album
    async getPublicPopularAlbums(
        offset: number,
        limit: number
    ): Promise<AlbumCollection> {
        const albums = await this.albumModel
            .find({ public: true })
            .populate({
                path: "tracks",
                select: "-__v -upload",
                populate: { path: "image", select: "-__v -upload" },
            })
            .populate("image", "-__v -upload")
            .sort({ popularity: -1 })
            .skip(offset)
            .limit(limit);
        const count = await this.albumModel
            .find({ public: true })
            .estimatedDocumentCount();
        return { items: albums, count };
    }

    // -- Private Popular Album
    async getPrivatePopularAlbums(
        offset: number,
        limit: number
    ): Promise<AlbumCollection> {
        const albums = await this.albumModel
            .find({ public: false })
            .populate({
                path: "tracks",
                select: "-__v -upload",
                populate: { path: "image", select: "-__v -upload" },
            })
            .populate("image", "-__v -upload")
            .sort({ popularity: -1 })
            .skip(offset)
            .limit(limit);
        const count = await this.albumModel
            .find({ public: false })
            .estimatedDocumentCount();
        return { items: albums, count };
    }

    // POST
    // -- Create Album
    async createAlbum(
        createAlbumDTO: CreateAlbumDTO,
        owner: string
    ): Promise<Album> {
        const result = await this.albumModel.create({
            ...createAlbumDTO,
            owner,
        });
        return result;
    }

    // PUT
    // -- Edit Album
    async editAlbum(
        albumId: string,
        editAlbumDTO: EditAlbumDTO,
        owner: string
    ): Promise<Album> {
        const fields = pickBy(omit(editAlbumDTO, "tracks"), (val) => val);
        if (isEmpty(fields)) {
            throw new BadRequestException(
                editAlbumDTO,
                "Update payload should include at least one updatable field"
            );
        }
        const res = await this.albumModel.findOneAndUpdate(
            { _id: albumId, owner },
            {
                $set: fields,
                $addToSet: { tracks: { $each: editAlbumDTO.tracks } },
            },
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

    // -- Private: Toggle Vote from UPVOTE to DOWNVOTE or vice versa
    async _toggleVoteAlbum(albumId: string, action: VoteTypeEnum) {
        const album = await this.albumModel.findById(albumId);

        if (action === VoteTypeEnum.UPVOTE) {
            const score = popularityCalc(
                album.upvotes + 1,
                album.downvotes - 1
            );
            await album.updateOne({
                $inc: { upvotes: 1, downvotes: -1 },
                $set: { popularity: score },
                updatedAt: Date.now(),
            });
        }

        if (action === VoteTypeEnum.DOWNVOTE) {
            const score = popularityCalc(
                album.upvotes - 1,
                album.downvotes + 1
            );
            await album.updateOne({
                $inc: { upvotes: -1, downvotes: 1 },
                $set: { popularity: score },
                updatedAt: Date.now(),
            });
        }
    }

    // -- Private: Calculate and Add Vote
    async _addVoteAlbum(albumId: string, action: VoteTypeEnum) {
        const album = await this.albumModel.findById(albumId);
        if (action === VoteTypeEnum.UPVOTE) {
            const score = popularityCalc(album.upvotes + 1, album.downvotes);
            await album.updateOne({
                $inc: { upvotes: 1 },
                $set: { popularity: score },
                updatedAt: Date.now(),
            });
        }

        if (action === VoteTypeEnum.DOWNVOTE) {
            const score = popularityCalc(album.upvotes, album.downvotes + 1);
            await album.updateOne({
                $inc: { downvotes: 1 },
                $set: { popularity: score },
                updatedAt: Date.now(),
            });
        }
    }

    // -- Private: Recall Previously Done Vote
    async _recallVoteAlbum(albumId: string, action: VoteTypeEnum) {
        const album = await this.albumModel.findById(albumId);
        if (action === VoteTypeEnum.UPVOTE) {
            const score = popularityCalc(album.upvotes - 1, album.downvotes);
            await album.updateOne({
                $inc: { upvotes: -1 },
                $set: { popularity: score },
                updatedAt: Date.now(),
            });
        }

        if (action === VoteTypeEnum.DOWNVOTE) {
            const score = popularityCalc(album.upvotes, album.downvotes - 1);
            await album.updateOne({
                $inc: { downvotes: -1 },
                $set: { popularity: score },
                updatedAt: Date.now(),
            });
        }
    }
    // - Upvote Album
    async upvoteAlbum(albumId: string, owner: string) {
        let shouldVote = true;
        // Find Vote Record
        const vote = await this.voteModel.findOne({
            owner,
            subjectId: albumId,
        });

        if (vote && vote.type === VoteTypeEnum.UPVOTE) {
            shouldVote = false;
        }

        if (shouldVote) {
            // Action is Add/Delete Vote
            const result = await this.voteModel.findOneAndUpdate(
                { owner, subjectId: albumId },
                {
                    $set: {
                        type: VoteTypeEnum.UPVOTE,
                        owner,
                        subject: VoteSubjectEnum.ALBUM,
                        subjectId: albumId,
                    },
                },
                { upsert: true, rawResult: true }
            );
            if (result.lastErrorObject.updatedExisting) {
                // If vote action was update
                await this._toggleVoteAlbum(albumId, VoteTypeEnum.UPVOTE);
            } else {
                await this._addVoteAlbum(albumId, VoteTypeEnum.UPVOTE);
            }
        } else {
            // Action is Unvote
            await vote.remove();
            await this._recallVoteAlbum(albumId, VoteTypeEnum.UPVOTE);
        }
    }

    // - Downvote Album
    async downvoteAlbum(albumId: string, owner: string) {
        let shouldVote = true;
        // Find Vote Record
        const vote = await this.voteModel.findOne({
            owner,
            subjectId: albumId,
        });

        if (vote && vote.type === VoteTypeEnum.DOWNVOTE) {
            shouldVote = false;
        }

        if (shouldVote) {
            // Action is Add/Delete Vote
            const result = await this.voteModel.findOneAndUpdate(
                { owner, subjectId: albumId },
                {
                    $set: {
                        type: VoteTypeEnum.DOWNVOTE,
                        owner,
                        subject: VoteSubjectEnum.ALBUM,
                        subjectId: albumId,
                    },
                },
                { upsert: true, rawResult: true }
            );
            if (result.lastErrorObject.updatedExisting) {
                // If vote action was update
                await this._toggleVoteAlbum(albumId, VoteTypeEnum.DOWNVOTE);
            } else {
                // If vote action was insert
                await this._addVoteAlbum(albumId, VoteTypeEnum.DOWNVOTE);
            }
        } else {
            // Action is Unvote
            await vote.remove();

            await this._recallVoteAlbum(albumId, VoteTypeEnum.DOWNVOTE);
        }
    }

    // DELETE
    // -- Delete Album
    async deleteAlbum(albumId: string, owner: string) {
        const res = await this.albumModel.findOneAndDelete(
            { _id: albumId, owner },
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
