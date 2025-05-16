import { z } from 'zod';

export const numberFactsSchema = z.object({
  number: z.string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Please enter a valid number',
    })
    .refine((val) => {
      const num = Number(val);
      return num > 0 && num <= 300;
    }, {
      message: 'The number must be from 1 to 300',
    }),
});

export type NumberFactsFormValues = z.infer<typeof numberFactsSchema>;