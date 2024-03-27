import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserType } from 'src/users/interface/user.interface';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<UserType | null>,
  ): Observable<{ data: UserType | null }> {
    return next
      .handle()
      .pipe(
        map((value) =>
          value === null
            ? { data: { firstName: '', lastName: '', id: 0, isActive: false } }
            : { data: value },
        ),
      );
  }
}
