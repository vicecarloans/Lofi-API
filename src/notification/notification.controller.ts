import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { NotificationEndpointParams } from './requests/notification-params';


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
