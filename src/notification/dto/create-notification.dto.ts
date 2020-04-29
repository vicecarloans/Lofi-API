import { NotificationTypeEnum } from "../enum/notification-type.enum";

export class CreateNotificationDTO {
    title: string;
    body: string;
    type: NotificationTypeEnum;
    
}