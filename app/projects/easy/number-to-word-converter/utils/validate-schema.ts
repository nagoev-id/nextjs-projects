import { z } from 'zod';

/**
 * Константы для валидации числа
 */
const NUMBER_CONSTRAINTS = {
  MIN: 1,
  MAX: 999_999_999,
} as const;

/**
 * Оптимизированная схема валидации для конвертера чисел в слова
 * @description Валидирует входное число с улучшенной производительностью
 */
export const formSchema = z.object({
  number: z
    .number({
      required_error: 'Number is required',
      invalid_type_error: 'Please enter a valid number',
    })
    .int('Number must be an integer')
    .min(NUMBER_CONSTRAINTS.MIN, `Number must be at least ${NUMBER_CONSTRAINTS.MIN}`)
    .max(NUMBER_CONSTRAINTS.MAX, `Number must be at most ${NUMBER_CONSTRAINTS.MAX.toLocaleString()}`),
});

/**
 * Тип для инференции схемы формы
 */
export type FormSchema = z.infer<typeof formSchema>;