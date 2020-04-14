import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BearerAuthGuard extends AuthGuard('bearer') {}