import { TrackService } from './track.service';
import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackSchema } from './track.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: "Track", schema: TrackSchema}])],
    controllers: [TrackController],
    providers: [TrackService],
})
export class TrackModule {};