import { z } from 'zod';

/**
 * Схема валидации формы для настроек квиза
 * @description Определяет правила валидации для полей формы настроек квиза
 * @see {@link https://github.com/colinhacks/zod} Документация Zod
 */
export const formSchema = z.object({
  /**
   * Количество вопросов в квизе
   * @type {string}
   * @min 1
   * @max 50
   */
  amount: z.string()
    .min(1, 'Minimum amount is 1')
    .max(50, 'Maximum amount is 50'),

  /**
   * Категория вопросов
   * @type {string}
   */
  category: z.string()
    .min(1, 'Category is required'),

  /**
   * Уровень сложности вопросов
   * @type {'any' | 'easy' | 'medium' | 'hard'}
   */
  difficulty: z.enum(['any', 'easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Please select a valid difficulty: any, easy, medium, or hard.' }),
  }),

  /**
   * Тип вопросов
   * @type {'any' | 'multiple' | 'boolean'}
   */
  type: z.enum(['any', 'multiple', 'boolean'], {
    errorMap: () => ({ message: 'Please select a valid type: any, multiple, boolean.' }),
  }),
});

/**
 * Тип данных формы, выведенный из схемы валидации
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;