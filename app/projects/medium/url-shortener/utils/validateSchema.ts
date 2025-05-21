import { z } from 'zod';

export const urlShortenerValidateSchema = z.object({
  url: z.string().url({
    message: 'Invalid URL format.',
  }),
});

export type UrlShortenerValidateSchemaSchema = z.infer<typeof urlShortenerValidateSchema>;