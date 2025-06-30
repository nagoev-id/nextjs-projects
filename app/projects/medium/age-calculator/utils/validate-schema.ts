import { z } from 'zod';

/**
 * Схема валидации формы калькулятора возраста
 * @description Определяет правила валидации для полей формы калькулятора возраста
 */
export const formSchema = z.object({
  /**
   * День рождения (1-31)
   * @type {string}
   */
  day: z.string()
    .min(1, 'Day is required')
    .refine((val) => {
      const day = parseInt(val);
      return day >= 1 && day <= 31;
    }, { message: 'Day must be between 1 and 31' }),

  /**
   * Месяц рождения (1-12)
   * @type {string}
   */
  month: z.string()
    .min(1, 'Month is required')
    .refine((val) => {
      const month = parseInt(val);
      return month >= 1 && month <= 12;
    }, { message: 'Month must be between 1 and 12' }),

  /**
   * Год рождения
   * @type {string}
   */
  year: z.string()
    .min(1, 'Year is required')
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear;
    }, { message: 'Year must be between 1900 and current year' }),

  /**
   * Текущая дата для расчета
   * @type {string}
   */
  currentDate: z.string()
    .min(1, 'Current date is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, { message: 'Please enter a valid date' }),
}).refine((data) => {
  // Дополнительная валидация: проверка корректности даты
  const day = parseInt(data.day);
  const month = parseInt(data.month);
  const year = parseInt(data.year);

  // Проверка существования даты
  const birthDate = new Date(year, month - 1, day);
  const isValidDate = birthDate.getDate() === day &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getFullYear() === year;

  if (!isValidDate) {
    return false;
  }

  // Проверка, что дата рождения не в будущем
  const currentDate = new Date(data.currentDate);
  return birthDate <= currentDate;
}, {
  message: 'Please enter a valid birth date that is not in the future',
  path: ['day'], // Показываем ошибку на поле дня
});

/**
 * Тип данных формы, выведенный из схемы валидации
 * @typedef {z.infer<typeof formSchema>} FormSchema
 */
export type FormSchema = z.infer<typeof formSchema>;