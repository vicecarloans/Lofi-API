import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        AlbumController, 
    ],
    providers: [
        AlbumService, 
    ],
})
export class AlbumModule {}
