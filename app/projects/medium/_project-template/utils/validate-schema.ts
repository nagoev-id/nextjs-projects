import { z } from 'zod';

export const validate = z.object({
  value: z.string()
    .trim()
    .min(2, { message: 'The input must be at least 2 characters long' }),
});

export type ValidateSchema = z.infer<typeof validate>;