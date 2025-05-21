import { z } from 'zod';

export const expenseTrackerValidateSchema = z.object({
  text: z.string()
    .trim()
    .min(1, { message: 'Text is required' })
    .max(50, { message: 'Text must be less than 50 characters' }),
  amount: z
    .string()
    .trim()
    .refine((value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue !== 0;
    }, { message: 'Amount must be a number and not zero' })
    .transform((value) => parseFloat(value)),
});

export type ExpenseTrackerSchema = z.infer<typeof expenseTrackerValidateSchema>;