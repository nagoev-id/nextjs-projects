import { z } from 'zod';

export const formSchema = z.object({
  login: z.string()
    .trim()
    .min(2, { message: 'The input must be at least 2 characters long' })
    .max(100, { message: 'First name should contain only Latin letters and be 2 to 100 characters long.' }),
});

export type FormSchema = z.infer<typeof formSchema>;