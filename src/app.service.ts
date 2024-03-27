import { Injectable } from '@nestjs/common';
// import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
