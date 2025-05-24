'use client';

/**
 * # Калькулятор кредита
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка формы**:
 *    - Приложение использует React Hook Form с Zod для валидации полей ввода
 *    - Форма содержит три поля: сумма кредита, процентная ставка и срок погашения в годах
 *    - Все поля имеют начальное значение 0 и проходят валидацию при изменении
 *
 * 2. **Процесс расчета**:
 *    - При отправке формы приложение переходит в состояние загрузки
 *    - Выполняется расчет ежемесячного платежа по формуле аннуитетного платежа:
 *      - Вычисляется месячная процентная ставка (годовая ставка / 100 / 12)
 *      - Определяется общее количество платежей (срок в годах * 12)
 *      - Применяется формула: P * (r * (1 + r)^n) / ((1 + r)^n - 1), где:
 *        - P = основная сумма кредита
 *        - r = месячная процентная ставка
 *        - n = общее количество платежей
 *    - На основе ежемесячного платежа вычисляются:
 *      - Общая выплаченная сумма (ежемесячный платеж * количество платежей)
 *      - Общая сумма процентов (общая выплаченная сумма - основная сумма кредита)
 *
 * 3. **Отображение результатов**:
 *    - После успешного расчета форма сбрасывается, и отображаются результаты:
 *      - Ежемесячный платеж
 *      - Общая выплаченная сумма основного долга
 *      - Общая сумма выплаченных процентов
 *    - Все суммы отображаются с двумя десятичными знаками и символом доллара
 *    - Результаты появляются с анимацией (изменение высоты контейнера)
 *
 * 4. **Обработка ошибок**:
 *    - При возникновении ошибок в процессе расчета показывается уведомление
 *    - Ошибки валидации формы отображаются под соответствующими полями
 *    - Все ошибки логируются в консоль для отладки
 *
 * 5. **Оптимизация производительности**:
 *    - Функция расчета кредита мемоизирована с помощью useCallback
 *    - Результаты для отображения мемоизированы с помощью useMemo
 *    - Состояние загрузки, успеха и ошибки управляется через единый объект состояния
 */

import { Button, Card, Form } from '@/components/ui';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { validate, ValidateSchema } from '@/app/projects/easy/loan-calculator/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/layout';
import { toast } from 'sonner';

/**
 * Тип для результатов расчета кредита
 *
 * @typedef {Object} LoanResult
 * @property {number} monthly - Ежемесячный платеж
 * @property {number} total - Общая сумма выплат
 * @property {number} totalInterest - Общая сумма процентов
 */
type LoanResult = {
  monthly: number;
  total: number;
  totalInterest: number;
};

/**
 * Компонент калькулятора кредита
 *
 * Позволяет пользователю рассчитать ежемесячный платеж, общую сумму выплат
 * и общую сумму процентов на основе введенных данных о кредите.
 *
 * @returns {JSX.Element} Компонент калькулятора кредита
 */
const LoanCalculatorPage = () => {
  /**
   * Состояние для отслеживания статуса операции расчета
   */
  const [status, setStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  /**
   * Состояние для хранения результатов расчета
   */
  const [result, setResult] = useState<LoanResult | null>(null);

  /**
   * Инициализация формы с валидацией через Zod
   */
  const form = useForm<ValidateSchema>({
    defaultValues: {
      amount: 0,
      interest: 0,
      repay: 0,
    },
    mode: 'onChange',
    resolver: zodResolver(validate),
  });

  /**
   * Обработчик отправки формы
   * Выполняет расчет кредита на основе введенных данных
   *
   * @param {ValidateSchema} values - Значения полей формы
   */
  const onSubmit = (values: ValidateSchema) => {
    setStatus({ isLoading: true, isSuccess: false, isError: false });
    try {
      const { amount, interest, repay } = values;
      setResult(calculateLoan({
        amount,
        interest,
        repay,
      }));
      form.reset();
      setStatus({ isLoading: false, isSuccess: true, isError: false });
    } catch (error) {
      console.error('An error occurred:', error);
      setStatus({ isLoading: false, isSuccess: false, isError: true });
      toast.error('Invalid input values', { richColors: true });
    }
  };

  /**
   * Функция для расчета параметров кредита
   * Использует формулу аннуитетного платежа
   *
   * @param {ValidateSchema} param0 - Параметры кредита
   * @param {number} param0.amount - Сумма кредита
   * @param {number} param0.interest - Годовая процентная ставка
   * @param {number} param0.repay - Срок погашения в годах
   * @returns {LoanResult} Результаты расчета кредита
   */
  const calculateLoan = useCallback(({ amount, interest, repay }: ValidateSchema): LoanResult => {
    const principal = amount;
    const monthlyInterest = interest / 100 / 12;
    const totalPayments = repay * 12;
    const x = Math.pow(1 + monthlyInterest, totalPayments);
    const monthlyPayment = (principal * x * monthlyInterest) / (x - 1);

    return {
      monthly: monthlyPayment,
      total: monthlyPayment * totalPayments,
      totalInterest: (monthlyPayment * totalPayments) - principal,
    };
  }, []);

  /**
   * Мемоизированный массив результатов для отображения
   * Преобразует объект результатов в массив для удобного рендеринга
   */
  const renderedContent = useMemo(() => {
    return result && [
      { label: 'Monthly Payments', value: result.monthly },
      { label: 'Total Principal Paid', value: result.total },
      { label: 'Total Interest Paid', value: result.totalInterest },
    ];
  }, [result]);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            form={form}
            name="amount"
            placeholder="Loan amount"
            type="number"
            label="Loan Amount"
          />
          <FormInput
            form={form}
            name="interest"
            placeholder="Interest"
            type="number"
            label="Interest Rate (%)"
          />
          <FormInput
            form={form}
            name="repay"
            placeholder="Years to repay"
            type="number"
            label="Repayment Period (years)"
          />
          <Button type="submit">
            {status.isLoading ? 'Loading...' : 'Calculate Loan'}
          </Button>
        </form>
      </Form>

      {status.isSuccess && result && (
        <ul
          className={`grid items-start gap-2 overflow-hidden place-items-center transition-all ${status.isSuccess ? 'h-[210px]' : 'h-0'}`}>
          {renderedContent?.map(({ label, value }) => (
            <li className="grid gap-2 text-center" key={label}>
              <p className="font-medium">{label}:</p>
              <p className="text-2xl font-bold"><sup>$</sup>{value.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default LoanCalculatorPage;