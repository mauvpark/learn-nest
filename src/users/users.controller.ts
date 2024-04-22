import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseInterceptors,
  // UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CreateUserInterceptor } from 'src/users/interceptor/create-user.interceptor';
// import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { createUserSchema } from 'src/users/model/dto/user.dto';
// import { ExcludeNullInterceptor } from 'src/users/interceptor/exclude-null.interceptor';
// import { TimeoutInterceptor } from 'src/users/interceptor/timeout.interceptor';
// import { UserType } from 'src/users/interface/user.interface';
import { UserValidationPipe } from 'src/users/pipe/user-validation.pipe';
import { UsersService } from 'src/users/users.service';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new UserValidationPipe(createUserSchema))
  @UseInterceptors(CreateUserInterceptor)
  async create(@Req() req: Request) {
    return this.usersService.create(req);
  }

  @Post('/many')
  async createMany(@Req() req: Request) {
    return this.usersService.createMany(req);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.usersService.findOne(id);
  }

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
