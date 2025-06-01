import { z } from 'zod';

/**
 * @fileoverview Схема валидации формы поиска книг с использованием Zod.
 * @description Этот файл содержит схему валидации для формы поиска книг,
 * а также экспортирует тип, основанный на этой схеме.
 */

/**
 * Схема валидации формы поиска книг.
 * @type {z.ZodObject<{query: z.ZodString}>}
 * 
 * @description
 * Определяет структуру и правила валидации для формы поиска книг.
 * Содержит одно поле 'query' с минимальной длиной 2 символа.
 */
export const formSchema = z.object({
  query: z.string().min(2, {
    message: 'Book title must be at least 2 characters.',
  }),
});

/**
 * Тип данных формы, выведенный из схемы валидации.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 * 
 * @description
 * Представляет структуру данных формы поиска книг.
 * Автоматически выводится из `formSchema` для обеспечения типобезопасности.
 */
export type FormSchema = z.infer<typeof formSchema>;