import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CreateCatDto, createCatSchema } from 'src/cats/dto/create-cat.dto';
import { TransformInterceptor } from 'src/cats/interceptor/transform.interceptor';
import { ZodValidationPipe } from 'src/common/pipe/zod-validation.pipe';
import { Roles } from 'src/users/decorator/roles.decorator';
import { ForbiddenException } from '../common/exception/forbidden.exception';
import { HttpExceptionFilter } from '../common/filter/http-exception.filter';
import { ExcludeNullInterceptor } from '../common/interceptor/exclude-null.interceptor';
import { LoggingInterceptor } from '../common/interceptor/logging.interceptor';
import { CatsService } from './cats.service';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './interface/cat.interface';

@Controller('cats')
// @UseGuards(RolesGuard)
// @UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Roles(['admin'])
  @UseInterceptors(TransformInterceptor)
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
    console.log('dto', createCatDto);
    return this.catsService.create(createCatDto);
  }

  @Get()
  @UseInterceptors(ExcludeNullInterceptor)
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get('error')
  async throwError() {
    throw new HttpException(
      { status: HttpStatus.FORBIDDEN, error: 'This is a custom message' },
      HttpStatus.FORBIDDEN,
      { cause: 'A reason of the bug' },
    );
  }

  @Get('forbidden')
  @UseFilters(new HttpExceptionFilter())
  async throwForbiddenExeption() {
    throw new ForbiddenException();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new DefaultValuePipe(0),
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat. ${updateCatDto.name}, ${updateCatDto.age}, ${updateCatDto.breed}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
