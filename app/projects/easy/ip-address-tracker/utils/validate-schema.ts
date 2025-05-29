import { z } from 'zod';

export const formSchema = z.object({
  query: z.string()
    .min(1, 'IP address is required')
    .refine(value => {
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      return ipPattern.test(value) && value.split('.').every(num => parseInt(num, 10) <= 255);
    }, { message: 'Please enter a valid IP address' }),
});

export type FormValues = z.infer<typeof formSchema>;