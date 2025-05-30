import { z } from 'zod';

/**
 * @description Схема валидации формы для поиска пользователя GitHub.
 * @type {z.ZodObject<{login: z.ZodString}>}
 */
export const formSchema = z.object({
  /**
   * @description Поле для ввода логина пользователя GitHub.
   * @type {z.ZodString}
   */
  login: z.string().min(2).max(100, {
    message: 'First name should contain only Latin letters and be 2 to 100 characters long.',
  }),
});

/**
 * @description Тип, выведенный из схемы формы.
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;