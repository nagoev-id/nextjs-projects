import { z } from 'zod';

export const validate = z.object({
  query: z.string()
    .trim()
    .min(2, {
      message: 'Search title must be at least 2 characters.',
    }),
});

export type ValidateSchema = z.infer<typeof validate>;
