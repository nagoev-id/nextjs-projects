import { z } from 'zod';

export const formSchema = z.object({
  query: z.string().min(2, {
    message: 'Movie title must be at least 2 characters.',
  }),
});

export const formCollectionSchema = z.object({
  collection: z.string().min(1, {
    message: 'Collection is required.',
  }),
});

export type FormSchema = z.infer<typeof formSchema>;
export type FormCollectionSchema = z.infer<typeof formCollectionSchema>;