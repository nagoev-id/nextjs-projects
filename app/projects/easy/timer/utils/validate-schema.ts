import { z } from 'zod';

/**
 * Схема валидации формы для проверки числового значения.
 * 
 * @type {z.ZodObject}
 * @property {z.ZodNumber} number - Числовое значение, которое должно быть целым, положительным и находиться в диапазоне от 1 до 60.
 * @description
 * Используется для валидации данных формы, где требуется ввод времени в минутах.
 * Значение должно быть целым числом от 1 до 60.
 */
export const formSchema = z.object({
  number: z.coerce
    .number()
    .int('Time must be an integer')
    .positive('Time must be a positive number')
    .min(1, 'Time must be at least 1')
    .max(60, 'Time must be at most 60'),
});

/**
 * Тип, выводимый из схемы валидации формы.
 * 
 * @typedef {Object} FormSchema
 * @property {number} number - Числовое значение, соответствующее условиям схемы.
 * @description
 * Используется для типизации данных, которые проходят валидацию через `formSchema`.
 */
export type FormSchema = z.infer<typeof formSchema>;