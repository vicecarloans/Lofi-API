import * as mongoose from 'mongoose'
import { NotificationTypeEnum } from './enum/notification-type.enum'

export const NotificationSchema = new mongoose.Schema({
    title: String,
    body: String,
    type: {
        type: String,
        default: NotificationTypeEnum.UPLOAD_STATUS
    },
    owner: String
})