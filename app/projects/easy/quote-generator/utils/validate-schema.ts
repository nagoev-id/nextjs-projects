import { z } from 'zod';

export const formSchema = z.object({
  source: z.string().min(1, 'Please select a source'),
});

export type FormValues = z.infer<typeof formSchema>;