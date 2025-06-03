import { z } from 'zod';

/**
 * @description Схема валидации формы поиска коктейлей
 * @type {z.ZodObject<{name: z.ZodString}>}
 * @see https://zod.dev/ - Документация библиотеки Zod
 */
export const formSchema = z.object({
  /**
   * @description Название коктейля для поиска
   * @type {z.ZodString}
   * @minLength 2 - Минимальная длина строки
   */
  name: z.string().min(2, {
    message: 'Cocktail must be at least 2 characters.',
  }),
});

/**
 * @typedef {Object} FormSchema
 * @description Тип данных, выведенный из схемы валидации формы
 * @property {string} name - Название коктейля для поиска
 */
export type FormSchema = z.infer<typeof formSchema>;