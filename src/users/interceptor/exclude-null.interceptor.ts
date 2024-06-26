import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserType } from 'src/users/model/interface/user.interface';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<UserType | null>,
  ): Observable<{ data: UserType | null }> {
    return next.handle().pipe(
      map((value) =>
        value === null
          ? {
              data: {
                id: 0,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                isActive: false,
                images: [],
                iv: '',
              },
            }
          : { data: value },
      ),
    );
  }
}
