import { z } from 'zod';

export const weatherFormValidateSchema = z.object({
  query: z.string()
    .trim()
    .min(2, { message: 'The input must be at least 2 characters long' }),
});

export type WeatherFormSchema = z.infer<typeof weatherFormValidateSchema>;