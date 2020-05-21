import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { NotificationEndpointParams } from './requests/notification-params';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationResponse } from 'src/swagger/responses/notification-response.dto';
import { Notification } from './notification.serialize'
@ApiTags("Notification Endpoints")
@Controller("notifications")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @ApiOperation({description: "Get Notification by Id"})
    @ApiBearerAuth()
    @ApiParam({name: "id"})
    @ApiOkResponse({description: "Notification Found", type: NotificationResponse})
    @UseGuards(BearerAuthGuard)
    @Get(":id")
    async getNotificationById(@Req() req ,@Param() params: NotificationEndpointParams) : Promise<Notification>{
        const {user: {claims}} = req;
        const {id} = params;

        const notification = await this.notificationService.getNotificationById(id, claims.uid);
        return new Notification(notification.toJSON())
    }
}
