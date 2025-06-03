import { z } from 'zod';

/**
 * Схема валидации формы с использованием Zod.
 * @type {z.ZodObject<{text: z.ZodString, amount: z.ZodEffects<z.ZodString>}>}
 */
export const formSchema = z.object({
  /**
   * Поле для текстового описания.
   * @type {z.ZodString}
   */
  text: z.string()
    .trim()
    .min(1, { message: 'Text is required' })
    .max(50, { message: 'Text must be less than 50 characters' }),

  /**
   * Поле для суммы.
   * @type {z.ZodEffects<z.ZodString>}
   */
  amount: z
    .string()
    .trim()
    .refine((value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue !== 0;
    }, { message: 'Amount must be a number and not zero' })
});

/**
 * Тип, выведенный из схемы формы.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;