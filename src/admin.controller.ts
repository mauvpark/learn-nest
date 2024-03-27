import { Controller, Get } from '@nestjs/common';

@Controller({ host: 'localhost:3000' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
