import { z } from 'zod';

export const schema = z.object({
  value: z.string()
    .trim()
    .min(2, { message: 'The input must be at least 2 characters long' }),
});

export type FormSchema = z.infer<typeof schema>;