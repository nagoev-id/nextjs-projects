import { z } from 'zod';

/**
 * Схема валидации формы поиска в Wikipedia.
 * @typedef {Object} FormSchemaType
 * @property {string} query - Поисковый запрос.
 */

/**
 * Объект схемы Zod для валидации формы поиска.
 * @type {z.ZodObject<{query: z.ZodString}>}
 */
export const formSchema = z.object({
  /**
   * Поле для ввода поискового запроса.
   * @type {z.ZodString}
   */
  query: z.string()
    .trim()
    .min(2, {
      message: 'Search title must be at least 2 characters.',
    }),
});

/**
 * Тип данных, выведенный из схемы формы поиска.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;