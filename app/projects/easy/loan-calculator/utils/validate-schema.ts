import { z } from 'zod';

/**
 * Схема валидации для формы калькулятора кредитов
 *
 * Проверяет:
 * - amount: сумма кредита (положительное число, не более 1 млрд)
 * - interest: процентная ставка (положительное число, не более 100%)
 * - repay: срок погашения в годах (положительное целое число, не более 50 лет)
 */
export const validate = z.object({
  amount: z.coerce
    .number()
    .positive('The amount of the loan should be a positive number')
    .min(1, 'Minimum loan amount - 1')
    .max(1_000_000_000, 'The maximum loan amount is 1,000,000,000')
    .refine(val => !isNaN(val), { message: 'Please enter the correct number' }),

  interest: z.coerce
    .number()
    .positive('The interest rate should be a positive number')
    .min(0.01, 'Minimum interest rate - 0.01%')
    .max(100, 'Maximum interest rate - 100%')
    .refine(val => !isNaN(val), { message: 'Please enter the correct number' }),

  repay: z.coerce
    .number()
    .int('The maturity of the repayment should be the whole number')
    .positive('The maturity of the repayment should be a positive number')
    .min(1, 'Minimum repayment period - 1 year')
    .max(50, 'Maximum repayment period - 50 years')
    .refine(val => !isNaN(val), { message: 'Please enter the correct number' }),
});

/**
 * Тип данных, соответствующий схеме валидации формы калькулятора кредитов
 * @typedef {Object} ValidateSchema
 * @property {number} amount - Сумма кредита
 * @property {number} interest - Годовая процентная ставка
 * @property {number} repay - Срок погашения в годах
 */
export type ValidateSchema = z.infer<typeof validate>;