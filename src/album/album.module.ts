import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema } from './album.schema';
import * as auditPlugin from 'mongoose-audit-trail';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Album',
        useFactory: () => {
          const schema = AlbumSchema;
          schema.plugin(auditPlugin.plugin);
          return schema;
        },
      },
    ]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
