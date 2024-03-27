import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { EnvironmentVariables } from 'src/config/configuration';
// import { ConfigService } from 'src/config/config.service';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return `Host: ${this.configService.get('database.host', { infer: true })}, ${this.appService.getHello()}`;
  }
}
