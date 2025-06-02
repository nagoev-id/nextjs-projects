import { z } from 'zod';

/**
 * Схема валидации формы для проверки числового значения в строковом формате.
 * 
 * @type {z.ZodObject}
 * @property {z.ZodString} number - Строковое значение, которое должно быть преобразуемо в число и находиться в диапазоне от 1 до 300.
 * @description
 * Используется для валидации данных формы, где требуется ввод числового значения в строковом формате.
 * Значение должно быть числом от 1 до 300.
 */
export const formSchema = z.object({
  number: z.string()
    .refine((val) => !isNaN(Number(val)), {
      message: 'Please enter a valid number',
    })
    .refine((val) => {
      const num = Number(val);
      return num > 0 && num <= 300;
    }, {
      message: 'The number must be from 1 to 300',
    }),
});

/**
 * Тип, выводимый из схемы валидации формы.
 * 
 * @typedef {Object} FormSchema
 * @property {string} number - Строковое значение, соответствующее условиям схемы.
 * @description
 * Используется для типизации данных, которые проходят валидацию через `formSchema`.
 */
export type FormSchema = z.infer<typeof formSchema>;