import { z } from 'zod';

/**
 * @description Схема валидации формы поиска новостей Hacker News.
 * @type {z.ZodObject<{search: z.ZodString}>}
 */
export const formSchema = z.object({
  /**
   * @description Поле для ввода поискового запроса.
   * @type {z.ZodString}
   */
  search: z.string()
    .trim()
    .min(2, { message: 'The input must be at least 2 characters long' }),
});

/**
 * @description Тип, выведенный из схемы формы.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;