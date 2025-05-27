import { z } from 'zod';

export const formSchema = z.object({
  review: z.string().min(2, {
    message: 'Review title must be at least 2 characters.',
  }),
  rating: z.string().refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1 && num <= 10;
    },
    {
      message: 'Rating must be a number between 1 and 10',
    },
  ),
});

export type FormSchema = z.infer<typeof formSchema>;