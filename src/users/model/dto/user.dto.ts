import { createUserImageSchema } from 'src/users/model/dto/user-image.dto';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    isActive: z.boolean(),
    images: z.array(createUserImageSchema),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
