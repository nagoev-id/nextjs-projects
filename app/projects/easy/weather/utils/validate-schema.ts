import { z } from 'zod';

/**
 * Схема валидации формы для поискового запроса погоды.
 * @typedef {Object} FormSchemaType
 * @property {string} query - Поисковый запрос для погоды.
 */

/**
 * Объект схемы Zod для валидации формы поиска погоды.
 * @type {z.ZodObject<{query: z.ZodString}>}
 */
export const formSchema = z.object({
  /**
   * Поле для ввода поискового запроса.
   * @type {z.ZodString}
   */
  query: z.string()
    .trim()
    .min(2, { message: 'The input must be at least 2 characters long' }),
});

/**
 * Тип данных, выведенный из схемы формы поиска погоды.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;