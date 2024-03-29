import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserType } from 'src/users/interface/user.interface';
import { ZodSchema } from 'zod';

export class UserValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<CreateUserDto>) {}

  transform(
    value: {
      firstName: string;
      lastName: string;
      isActive: boolean;
    },
    metadata: ArgumentMetadata,
  ) {
    try {
      console.log('before trans', value);
      const transformed: UserType = {
        ...value,
        isActive: Boolean(value.isActive),
      };
      const parsedValue = this.schema.parse(transformed);
      console.log('pp', parsedValue);
      return parsedValue;
    } catch (error) {
      console.error(error.errors);
      throw new BadRequestException(
        `Validation failed: ${error.errors[0].path}-${error.errors[0].message}`,
      );
    }
  }
}
