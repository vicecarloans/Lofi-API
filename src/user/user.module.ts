import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UploadSchema } from 'src/upload/upload.schema';
import { NotificationSchema } from 'src/notification/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: "User",
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      },
      {
        name: "Upload",
        useFactory: () => {
          const schema = UploadSchema;
          return schema;
        },
      },
      {
        name: "Notification",
        useFactory: () => {
          const schema = NotificationSchema;
          return schema;
        }
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
