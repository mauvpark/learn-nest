import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
// import { User as UserDecorator } from 'src/users/decorator/user.decorator';
// import { ExcludeNullInterceptor } from 'src/users/interceptor/exclude-null.interceptor';
// import { TimeoutInterceptor } from 'src/users/interceptor/timeout.interceptor';
// import { UserType } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('/profile')
  // @UsePipes(new UserValidationPipe(createUserSchema))
  async create(@Req() req: Request) {
    return this.usersService.patchProfile(req);
  }

  @Post('/many')
  async createMany(@Req() req: Request) {
    return this.usersService.createMany(req);
  }

  // INFO signedCookie: 쿠키가 사용자에 의해 변경 되었는지를 시그니처를 통해 확인하는 절차를 거침.
  // 관련 내용: https://stackoverflow.com/a/11898142
  @Get()
  async findAll() {
    // ) // @Res() res // @Req() req, // (
    // console.log('cookies', req.signedCookies);
    // res.cookie('mysign', 'mycookie', { signed: true });
    // res.end();
    return this.usersService.findAll();
  }

  // @Get(':id')
  // async findOne(
  //   @Param(
  //     'id',
  //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   id: number,
  // ) {
  //   return this.usersService.findOne(id);
  // }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.usersService.remove(id);
  }

  // @UseInterceptors(ExcludeNullInterceptor)
  // @UseInterceptors(TimeoutInterceptor)
  // async findUser(
  //   @UserDecorator(
  //     'attr',
  //     new ValidationPipe({ validateCustomDecorators: true }),
  //   )
  //   attr: string,
  // ): Promise<UserType | null | string> {
  //   return attr ?? this.usersService.user;
  // }
}
