import { IsMongoId } from "class-validator";

export class NotificationEndpointParams {
  @IsMongoId()
  id: string;
}
