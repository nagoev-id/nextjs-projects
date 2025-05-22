'use client';

/**
 * # Трекер расходов (Expense Tracker)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и хранение данных**:
 *    - Приложение использует кастомный хук useStorage для сохранения транзакций в localStorage
 *    - При первой загрузке проверяется наличие сохраненных транзакций
 *    - Состояние приложения включает список транзакций и финансовые показатели (баланс, доходы, расходы)
 *
 * 2. **Управление транзакциями**:
 *    - Пользователь может добавлять новые транзакции через форму ввода
 *    - Каждая транзакция имеет текстовое описание и сумму (положительную для доходов, отрицательную для расходов)
 *    - Транзакции сохраняются в локальном хранилище браузера автоматически
 *    - Возможность удаления отдельных транзакций с подтверждением через диалоговое окно
 *    - Функция полной очистки истории транзакций с помощью кнопки "Clear All"
 *
 * 3. **Расчет и отображение финансовых показателей**:
 *    - Общий баланс рассчитывается как сумма всех транзакций
 *    - Доходы - сумма всех положительных транзакций
 *    - Расходы - сумма всех отрицательных транзакций
 *    - Все показатели автоматически пересчитываются при любом изменении списка транзакций
 *    - Форматирование сумм в денежном формате с символом доллара и двумя знаками после запятой
 *
 * 4. **Визуальное представление**:
 *    - Доходы отображаются зеленым цветом для быстрой идентификации
 *    - Расходы отображаются красным цветом
 *    - История транзакций представлена в виде прокручиваемого списка с цветовой кодировкой
 *    - Каждая транзакция в истории имеет кнопку удаления с подтверждением
 *    - Адаптивный дизайн с использованием Tailwind CSS
 *
 * 5. **Валидация данных**:
 *    - Проверка корректности ввода с помощью библиотеки Zod
 *    - Валидация текстового описания (не пустое)
 *    - Валидация суммы (должна быть числом)
 *    - Предотвращение добавления некорректных транзакций
 *    - Обратная связь через уведомления (toast) об успешных операциях или ошибках
 *
 * 6. **Управление формой**:
 *    - Использование React Hook Form для управления состоянием формы
 *    - Интеграция с Zod для валидации полей
 *    - Автоматический сброс формы после успешного добавления транзакции
 *    - Информативные подсказки для пользователя
 *
 * 7. **Обработка ошибок**:
 *    - Отлов и логирование ошибок при работе с localStorage
 *    - Уведомления пользователя о проблемах с сохранением данных
 *    - Предотвращение сбоев приложения при некорректных данных
 */

import { Card } from '@/components/ui/card';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validate, ValidateSchema } from '@/app/projects/easy/expense-tracker/utils';
import { Form } from '@/components/ui/form';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@/app/projects/easy/countdown/hooks';

/**
 * Тип для представления финансовой транзакции
 * @typedef {Object} Transaction
 * @property {string} id - Уникальный идентификатор транзакции
 * @property {string} text - Описание транзакции
 * @property {number} amount - Сумма транзакции (положительная для доходов, отрицательная для расходов)
 */
type Transaction = {
  id: string;
  text: string;
  amount: number | string;
}

/**
 * Тип для хранения финансовых показателей
 * @typedef {Object} Amount
 * @property {string} total - Общий баланс в формате строки с символом валюты
 * @property {string} income - Сумма доходов в формате строки с символом валюты
 * @property {string} expense - Сумма расходов в формате строки с символом валюты
 */
type Amount = {
  total: string;
  income: string;
  expense: string;
}

/**
 * Тип для элементов отображения финансовых показателей
 * @typedef {Object} ItemData
 * @property {'plus'|'minus'} type - Тип показателя (доход или расход)
 * @property {string} label - Название показателя
 * @property {number} value - Числовое значение показателя
 */
type ItemData = {
  type: 'plus' | 'minus';
  label: string;
  value: number;
}

/**
 * Компонент трекера расходов
 * Позволяет отслеживать доходы и расходы, вести историю транзакций
 * и видеть текущий финансовый баланс
 *
 * @returns {JSX.Element} Компонент страницы трекера расходов
 */
const ExpenseTrackerPage = () => {
  // Хук для работы с localStorage, возвращает текущие данные, функцию обновления и функцию сброса
  const [storedTransactions, setStoredTransactions, resetStoredTransactions] = useStorage<Transaction[]>('expense-tracker-transactions', []);

  // Состояние для списка транзакций, инициализируется данными из localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(storedTransactions);

  // Состояние для финансовых показателей с начальными значениями
  const [amount, setAmount] = useState<Amount>({
    total: '$0.00',
    income: '+$0.00',
    expense: '-$0.00',
  });

  // Настройка формы с валидацией через React Hook Form и Zod
  const form = useForm<ValidateSchema>({
    defaultValues: {
      text: '',
      amount: String(''),
    },
    mode: 'onChange',
    resolver: zodResolver(validate),
  });

  /**
   * Форматирует числовое значение в денежный формат
   * @param {number} value - Числовое значение для форматирования
   * @returns {string} Отформатированная строка с символом валюты
   */
  const formatValue = (value: number): string => {
    return isNaN(value) ? '$0.00' : `$${Math.abs(value).toFixed(2)}`;
  };

  // Обновляем суммы при изменении транзакций и сохраняем в localStorage
  useEffect(() => {
    try {
      // Сохраняем текущие транзакции в localStorage
      setStoredTransactions(transactions);

      // Вычисляем финансовые показатели на основе всех транзакций
      const amounts = transactions.reduce(
        (acc, transaction) => {
          const { amount } = transaction;
          const positiveAmount = Number(amount);
          acc.total += positiveAmount;
          if (positiveAmount > 0) {
            acc.income += positiveAmount;
          } else {
            acc.expense += positiveAmount;
          }
          return acc;
        },
        { total: 0, income: 0, expense: 0 },
      );

      // Форматируем суммы для отображения
      setAmount({
        total: formatValue(amounts.total),
        income: `+${formatValue(amounts.income)}`,
        expense: `-${formatValue(Math.abs(amounts.expense))}`,
      });
    } catch (error) {
      console.error('Error updating transactions:', error);
      toast.error('Failed to save transactions', { richColors: true });
    }
  }, [transactions, setStoredTransactions]);

  // Мемоизированный массив элементов для отображения доходов и расходов
  const items: ItemData[] = useMemo(() => [
    { type: 'plus', label: 'Income', value: parseFloat(amount.income.replace(/[^0-9.-]+/g, '')) || 0 },
    { type: 'minus', label: 'Expense', value: parseFloat(amount.expense.replace(/[^0-9.-]+/g, '')) || 0 },
  ], [amount.income, amount.expense]);

  /**
   * Обработчик удаления транзакции
   * @param {string} id - Идентификатор удаляемой транзакции
   */
  const handleDeleteButtonClick = useCallback((id: string) => {
    setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== id));
    toast.success('Transaction deleted successfully', { richColors: true });
  }, []);

  /**
   * Обработчик отправки формы для добавления новой транзакции
   * @param {ValidateSchema} data - Данные формы (текст и сумма)
   */
  const onSubmit = useCallback(({ text, amount }: ValidateSchema) => {
    setTransactions(prevTransactions => [...prevTransactions, {
      id: uuidv4(),
      text,
      amount,
    }]);

    toast.success('Transaction added successfully', { richColors: true });
    form.reset();
  }, [form]);

  /**
   * Функция для сброса всех транзакций
   * Очищает localStorage и сбрасывает состояние приложения
   */
  const handleResetAll = () => {
    resetStoredTransactions();
    setTransactions([]);
    toast.success('All transactions cleared', { richColors: true });
  };

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <div className="gap-3 grid">
        <header className="bg-slate-50 dark:bg-slate-800 border rounded p-4 text-center">
          <h2 className="text-xl font-bold mb-2">Your Balance</h2>
          <p className="text-3xl font-bold">{amount.total}</p>
        </header>
        <ul className="grid grid-cols-2">
          {items.map(({ type, label, value }, index) => (
            <li key={index} className="flex flex-col">
              <p className="border flex font-bold items-center justify-center p-3">{label}</p>
              <p
                className={`border flex font-bold items-center justify-center p-3 text-lg ${
                  type === 'plus' ? 'text-green-500' : 'text-red-400'
                }`}
              >
                {formatValue(value)}
              </p>
            </li>
          ))}
        </ul>

        {transactions.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <h5 className="bg-slate-50 dark:bg-slate-800 border font-bold p-2 rounded flex-grow">History</h5>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetAll}
                className="ml-2"
                aria-label="Clear all transactions"
              >
                Clear All
              </Button>
            </div>
            <ul className="gap-2 grid max-h-[200px] overflow-auto">
              {transactions.map(({ id, text, amount }) => {
                const isNegative = Number(amount) < 0;
                const itemClass = `border-2 flex p-2 gap-2 rounded ${
                  isNegative ? 'bg-red-50 border-red-500 dark:bg-red-900/20' : 'bg-green-50 border-green-500 dark:bg-green-900/20'
                }`;
                const amountText = `${isNegative ? '-' : '+'}$${Math.abs(Number(amount)).toFixed(2)}`;
                const amountClass = `ml-auto font-bold ${isNegative ? 'text-red-400' : 'text-green-500'}`;

                return (
                  <li key={id} className={itemClass}>
                    <p className="flex-grow">{text}</p>
                    <span className={amountClass}>{amountText}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash2 className="cursor-pointer text-red-500" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your transaction.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction aria-label="Delete transaction"
                                             onClick={() => handleDeleteButtonClick(id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <>
          <h5 className="bg-slate-50 dark:bg-slate-800 border font-bold p-2 rounded">Add new transaction</h5>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
              <FormInput
                form={form}
                name="text"
                label="Text"
                placeholder="Enter text"
              />
              <FormInput
                form={form}
                name="amount"
                label="Amount"
                placeholder="Amount (negative - expense, positive - income)"
              />
              <Button type="submit">
                Add transaction
              </Button>
            </form>
          </Form>
        </>
      </div>
    </Card>
  );
};

export default ExpenseTrackerPage;