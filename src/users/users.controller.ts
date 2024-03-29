import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  // UseInterceptors,
  UsePipes,
} from '@nestjs/common';
// import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { CreateUserDto, createUserSchema } from 'src/users/dto/create-user.dto';
// import { ExcludeNullInterceptor } from 'src/users/interceptor/exclude-null.interceptor';
// import { TimeoutInterceptor } from 'src/users/interceptor/timeout.interceptor';
// import { UserType } from 'src/users/interface/user.interface';
import { UserValidationPipe } from 'src/users/pipe/user-validation.pipe';
import { UsersService } from 'src/users/users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new UserValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
