import { z } from 'zod';

export const createUserImageSchema = z
  .object({
    url: z.string(),
    userId: z.number(),
  })
  .required();
