import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Todo title must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Todo description must be at least 2 characters.',
  }),
  category: z.string(),
  color: z.string(),
  date: z.date(),
});

export type FormSchema = z.infer<typeof formSchema>;
