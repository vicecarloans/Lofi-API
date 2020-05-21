import { BaseDBObject } from "src/utils/serializeBase";
import { NotificationTypeEnum } from "./enum/notification-type.enum";

export class Notification extends BaseDBObject {
  title: string;
  body: string;
  type: NotificationTypeEnum;
  owner: string;

  constructor(partial: Partial<Notification> = {}) {
      super();
      Object.assign(this, partial);
  }
}
