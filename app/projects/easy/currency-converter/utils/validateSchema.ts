import { z } from 'zod';

export const validate = z.object({
  amount: z.string()
    .min(1, { message: 'Amount is required' })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Amount must be a valid number',
    })
    .transform((val) => Number(val)), // Преобразуем строку в число
  from: z.string().min(1, { message: 'From currency is required' }),
  to: z.string().min(1, { message: 'To currency is required' }),
});

export type ValidateSchema = z.infer<typeof validate>;