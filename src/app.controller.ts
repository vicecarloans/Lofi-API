import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger'
@Controller()
export class AppController {
  @ApiOperation({summary: "Hello Message"})
  @Get()
  getHello(): string {
    return 'Welcome to Lofi-OpenAPI';
  }
}
