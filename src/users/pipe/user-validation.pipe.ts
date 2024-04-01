import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/model/dto/user.dto';
import { UserType } from 'src/users/model/interface/user.interface';
import { ZodSchema } from 'zod';

export class UserValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<CreateUserDto>) {}

  transform(value: Omit<UserType, 'id'>, metadata: ArgumentMetadata) {
    try {
      console.log('before trans', value);
      const transformed: UserType = {
        ...value,
        isActive: Boolean(value.isActive),
      };
      const parsedValue = this.schema.parse(transformed);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException(
        `Validation failed: ${error.errors[0].path}-${error.errors[0].message}`,
      );
    }
  }
}
