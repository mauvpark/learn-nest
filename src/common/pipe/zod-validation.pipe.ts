import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { CreateCatDto } from 'src/cats/model/dto/cat.dto';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<CreateCatDto>) {}

  transform(
    value: { id: string; name: string; age: string; breed: string },
    metadata: ArgumentMetadata,
  ) {
    try {
      const transformed = {
        ...value,
        age: parseInt(value.age),
      };
      const parsedValue = this.schema.parse(transformed);
      return parsedValue;
    } catch (error) {
      console.error(error.errors);
      throw new BadRequestException(
        `Validation failed: ${error.errors[0].path}-${error.errors[0].message}`,
      );
    }
  }
}
