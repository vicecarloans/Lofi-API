import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema } from './album.schema';
import { VoteSchema } from 'src/vote/vote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Album',
        schema: AlbumSchema
      },
      {
        name: 'Vote',
        schema: VoteSchema
      }
    ]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
