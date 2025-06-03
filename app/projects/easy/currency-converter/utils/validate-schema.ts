import { z } from 'zod';

/**
 * Схема валидации формы для конвертера валют.
 * @typedef {Object} FormSchemaType
 * @property {string} amount - Сумма для конвертации.
 * @property {string} from - Исходная валюта.
 * @property {string} to - Целевая валюта.
 */

/**
 * Объект схемы Zod для валидации формы конвертера валют.
 * @type {z.ZodObject<{amount: z.ZodEffects<z.ZodString>, from: z.ZodString, to: z.ZodString}>}
 */
export const formSchema = z.object({
  /**
   * Поле для ввода суммы.
   * @type {z.ZodEffects<z.ZodString>}
   */
  amount: z.string()
    .min(1, { message: 'Amount is required' })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Amount must be a valid number',
    }),

  /**
   * Поле для выбора исходной валюты.
   * @type {z.ZodString}
   */
  from: z.string().min(1, { message: 'From currency is required' }),

  /**
   * Поле для выбора целевой валюты.
   * @type {z.ZodString}
   */
  to: z.string().min(1, { message: 'To currency is required' }),
});

/**
 * Тип данных, выведенный из схемы формы конвертера валют.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;