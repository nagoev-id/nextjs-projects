import { z } from 'zod';

/**
 * @description Схема валидации формы трекера потребления воды
 * 
 * Схема проверяет:
 * - goal: цель потребления воды в литрах (от 1 до 10)
 * - size: размер стакана в миллилитрах (должен быть строкой, представляющей число)
 * 
 * @see https://zod.dev/ - Документация по Zod
 */
export const formSchema = z.object({
  /**
   * Цель потребления воды в литрах
   * Автоматически преобразуется в число из строки с помощью z.coerce
   */
  goal: z.coerce.number()
    .min(1, { message: 'The goal should be at least 1 liter' })
    .max(10, { message: 'The goal should not exceed 10 liters' })
    .refine(val => !isNaN(val), { 
      message: 'Please enter the correct number'
    }),
    
  /**
   * Размер стакана в миллилитрах
   * Должен быть строкой, представляющей положительное число
   */
  size: z.string()
    .refine(val => !isNaN(Number(val)), { 
      message: 'The size of the glass should be a number'
    })
    .refine(val => Number(val) > 0, { 
      message: 'The size of the glass should be a positive number'
    })
});

/**
 * Тип данных формы, выведенный из схемы валидации
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;