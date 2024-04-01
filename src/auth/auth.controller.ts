import {
  Controller,
  Get,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { ExcludeNullInterceptor } from 'src/users/interceptor/exclude-null.interceptor';
import { TimeoutInterceptor } from 'src/users/interceptor/timeout.interceptor';
import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { UserType } from 'src/users/model/interface/user.interface';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseInterceptors(ExcludeNullInterceptor)
  @UseInterceptors(TimeoutInterceptor)
  async findUser(
    @UserDecorator(
      'attr',
      new ValidationPipe({ validateCustomDecorators: true }),
    )
    attr: string,
  ): Promise<UserType | null | string> {
    return attr ?? this.authService.user;
  }
}
