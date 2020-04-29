import { ApiProperty } from '@nestjs/swagger'
import { NotificationTypeEnum } from '../enum/notification-type.enum';
export class NotificationResponse {
    @ApiProperty({name: "title", type: "string"})
    title: string;
    @ApiProperty({name: "body", type: "string"})
    body: string;
    @ApiProperty({name: "type", type: "string", enum: NotificationTypeEnum})
    type: NotificationTypeEnum;
    @ApiProperty({name: "owner", type: "string"})
    owner: string;
}