import { z } from 'zod';

export const timerSchema = z.object({
  number: z.coerce
    .number()
    .int('Time must be an integer')
    .positive('Time must be a positive number')
    .min(1, 'Time must be at least 1')
    .max(60, 'Time must be at most 60'),
});

export type TimerFormValues = z.infer<typeof timerSchema>;