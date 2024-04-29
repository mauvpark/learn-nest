import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserInterceptor } from 'src/auth/interceptor/create-user.interceptor';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { TimeoutInterceptor } from 'src/users/interceptor/timeout.interceptor';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  @UseInterceptors(CreateUserInterceptor)
  @UseInterceptors(TimeoutInterceptor)
  async signUp(@Req() req: Request) {
    const result = await this.authService.signUp(req);

    return result;
  }

  @Get('/signIn')
  async signIn(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.authService.signIn(req);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.send({ message: 'Login Success!', status: 200 });
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
