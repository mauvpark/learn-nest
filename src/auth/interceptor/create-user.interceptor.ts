import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserType } from 'src/users/model/interface/user.interface';

@Injectable()
export class CreateUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<UserType> {
    const req = context.switchToHttp().getRequest();
    const body: UserType = req.body;
    const reject =
      !body?.email || !body?.password || !body?.firstName || !body?.lastName;

    if (!reject) {
      return next.handle();
    } else {
      throw new BadRequestException();
    }
  }
}
