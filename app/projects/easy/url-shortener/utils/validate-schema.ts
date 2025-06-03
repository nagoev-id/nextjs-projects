import { z } from 'zod';

/**
 * Схема валидации формы для сокращения URL.
 * @typedef {Object} FormSchemaType
 * @property {string} url - URL для сокращения.
 */

/**
 * Объект схемы Zod для валидации формы.
 * @type {z.ZodObject<{url: z.ZodString}>}
 */
export const formSchema = z.object({
  /**
   * Поле для ввода URL.
   * @type {z.ZodString}
   */
  url: z.string().url({
    message: 'Invalid URL format.',
  }),
});

/**
 * Тип данных, выведенный из схемы формы.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;