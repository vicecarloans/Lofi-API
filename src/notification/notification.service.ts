import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.interface'
import { CreateNotificationDTO } from './dto/create-notification.dto';
@Injectable()
export class NotificationService {
    constructor(@InjectModel("Notification") private readonly notificationModel: Model<Notification>){}

    async getNotificationById(notificationId: string, owner:string) : Promise<Notification> {
        return this.notificationModel.findOne({_id: notificationId, owner});
    }

    async createNotification(createNotificationDTO: CreateNotificationDTO, owner: string) : Promise<Notification> {
        return this.notificationModel.create({...createNotificationDTO, owner});
    }
}
