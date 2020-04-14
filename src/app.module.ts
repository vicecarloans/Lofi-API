import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpStrategy } from './auth/http.strategy'
import { AuthService } from './auth/auth.service'
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [HttpStrategy, AuthService],
})
export class AppModule {}
