import { z } from 'zod';

/**
 * Схема валидации для формы поиска.
 * @typedef {Object} FormSearchSchema
 * @property {string} search - Строка поиска (минимум 2 символа).
 */
export const formSearchSchema = z.object({
  search: z.string()
    .min(2, 'Title must be at least 2 characters long'),
});

/**
 * Схема валидации для выбора страны.
 * @typedef {Object} FormCountrySchema
 * @property {string} country - Выбранная страна.
 */
export const formCountrySchema = z.object({
  country: z.string(),
});

/**
 * Тип данных для формы поиска, выведенный из схемы валидации.
 * @type {z.infer<typeof formSearchSchema>}
 */
export type FormSearchSchema = z.infer<typeof formSearchSchema>;

/**
 * Тип данных для формы выбора страны, выведенный из схемы валидации.
 * @type {z.infer<typeof formCountrySchema>}
 */
export type FormCountrySchema = z.infer<typeof formCountrySchema>;