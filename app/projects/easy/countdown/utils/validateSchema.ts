import { z } from 'zod';

export const countdownSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(50, { message: 'Title must be less than 50 characters' })
    .refine(value => value.trim().length > 0, {
      message: 'Title cannot be empty or contain only spaces',
    }),
  date: z
    .string()
    .refine((date) => {
      const currentDate = new Date();
      const selectedDate = new Date(date);
      return selectedDate > currentDate;
    }, { message: 'Date must be in the future' }),
});

export type CountdownFormValues = z.infer<typeof countdownSchema>;