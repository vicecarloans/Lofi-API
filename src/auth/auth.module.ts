import { Module } from '@nestjs/common';
import { HttpStrategy } from './http.strategy';
import { AuthService } from './auth.service';

@Module({
  controllers: [],
  providers: [HttpStrategy, AuthService],
})
export class AuthModule {}
