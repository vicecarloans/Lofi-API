import { Injectable } from "@nestjs/common";
import * as OktaJwtVerifier from '@okta/jwt-verifier'

@Injectable()
export class AuthService {
  oktaVerifier: InstanceType<OktaJwtVerifier>;

  constructor() {
    this.oktaVerifier = new OktaJwtVerifier({
      issuer: process.env.ISSUER,
      clientId: process.env.CLIENT_ID,
    });
  }

  async validateToken(token: string): Promise<any>{
      return await this.oktaVerifier.verifyAccessToken(token);
  }
}