import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { IsMongoId } from 'class-validator';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';

class NotificationEndpointParams {
    @IsMongoId()
    id: string;
}
@Controller("notifications")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @UseGuards(BearerAuthGuard)
    @Get(":id")
    async getNotificationById(@Req() req ,@Param() params: NotificationEndpointParams) {
        const {user: {claims}} = req;
        const {id} = params;

        return this.notificationService.getNotificationById(id, claims.uid);
    }
}
