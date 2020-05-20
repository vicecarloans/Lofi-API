import { Document } from 'mongoose'
import { NotificationTypeEnum } from './enum/notification-type.enum';
export interface INotification extends Document{
    title: string;
    body: string;
    type: NotificationTypeEnum;
    owner: string;
}