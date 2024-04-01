import { z } from 'zod';

export const createUserImageSchema = z
  .object({
    id: z.number(),
    url: z.string(),
    userId: z.number(),
  })
  .required();
