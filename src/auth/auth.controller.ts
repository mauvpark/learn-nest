import { Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { TimeoutInterceptor } from 'src/users/interceptor/timeout.interceptor';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  @UseInterceptors(TimeoutInterceptor)
  async signUp(@Req() req) {
    const result = await this.authService.signUp(req);

    return result;
  }

  @Get('/signIn')
  async signIn(@Req() req) {
    const result = await this.authService.signIn(req);

    return result;
  }
  // @Get()
  // @UseInterceptors(ExcludeNullInterceptor)
  // @UseInterceptors(TimeoutInterceptor)
  // async findUser(
  //   @UserDecorator(
  //     'attr',
  //     new ValidationPipe({ validateCustomDecorators: true }),
  //   )
  //   attr: string,
  // ): Promise<UserType | null | string> {
  //   return attr ?? this.authService.user;
  // }
}
