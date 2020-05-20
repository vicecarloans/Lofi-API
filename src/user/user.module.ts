import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UploadSchema } from 'src/upload/upload.schema';
import { NotificationSchema } from 'src/notification/notification.schema';
import { TrackSchema } from 'src/track/track.schema';
import { AlbumSchema } from 'src/album/album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "User",
        schema: UserSchema
      },
      {
        name: "Upload",
        schema: UploadSchema
      },
      {
        name: "Notification",
        schema: NotificationSchema
      },
      {
        name: "Track",
        schema: TrackSchema
      },
      {
        name: "Album",
        schema: AlbumSchema
      }
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
