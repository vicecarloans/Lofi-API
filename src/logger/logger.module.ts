import { Module, Global } from '@nestjs/common';
import { AppLoggerService } from './applogger.service';

@Global()
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
