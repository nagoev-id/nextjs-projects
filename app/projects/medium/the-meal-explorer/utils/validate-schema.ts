import { z } from 'zod';


export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal must be at least 2 characters.',
  }),
});

export type FormSchema = z.infer<typeof formSchema>;