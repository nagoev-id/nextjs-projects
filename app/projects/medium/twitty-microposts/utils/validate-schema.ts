import { z } from 'zod';

export const formSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(100, 'Title must not exceed 100 characters'),
  body: z.string().min(2, 'Body must be at least 2 characters long'),
});

export type FormSchema = z.infer<typeof formSchema>;