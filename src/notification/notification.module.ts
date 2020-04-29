import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
