import { Controller, Get, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './track.interface';

@Controller('track')
export class TrackController {
    constructor(private readonly trackService: TrackService){}

    @Get("")
    async getAllPublicTracks(@Query("offset") offset = 0, @Query("limit") limit = 0) : Promise<Track[]>{
        return this.trackService.getPublicTracks(offset, limit)
    }
}