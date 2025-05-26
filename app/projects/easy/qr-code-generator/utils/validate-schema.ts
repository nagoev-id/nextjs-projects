import { z } from 'zod';

export const validate = z.object({
  text: z.string()
    .trim()
    .min(2, { message: 'The input must be at least 2 characters long' })
    .max(1000, { message: 'The input must not exceed 1000 characters' }),
  size: z.string(),
});

export type ValidateSchema = z.infer<typeof validate>;