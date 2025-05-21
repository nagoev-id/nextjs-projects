import { z } from 'zod';

export const guessNumberSchema = z.object({
  number: z.string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Please enter a valid number',
    })
    .refine((val) => /^\d+$/.test(val), {
      message: 'The number must contain only digits without spaces',
    })
    .refine((val) => {
      const num = Number(val);
      return num >= 1 && num <= 10;
    }, {
      message: 'The number must be from 1 to 10',
    }),
});

export type GuessNumberValues = z.infer<typeof guessNumberSchema>;