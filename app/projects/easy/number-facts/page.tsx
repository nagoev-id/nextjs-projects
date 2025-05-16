'use client';

/**
 * # Факты о числах
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение создает форму с полем ввода для числа
 *    - Устанавливаются начальные состояния для данных, загрузки и ошибок
 *    - Форма настраивается с валидацией через Zod схему
 *
 * 2. **Ввод числа**:
 *    - Пользователь вводит число в диапазоне от 1 до 300
 *    - Валидация происходит в режиме реального времени (onChange)
 *    - Кнопка отправки формы активируется только при валидном вводе
 *
 * 3. **Получение факта**:
 *    - При отправке формы выполняется запрос к API numbersapi.com
 *    - Во время загрузки отображается индикатор Spinner
 *    - Используется кастомный хук useAxios для управления состоянием запроса
 *
 * 4. **Отображение результатов**:
 *    - После успешного запроса факт отображается пользователю
 *    - Рядом с фактом есть кнопка для копирования текста в буфер обмена
 *    - При ошибке запроса показывается соответствующее сообщение
 *
 * 5. **Управление состоянием**:
 *    - Для оптимизации производительности используются useCallback
 *    - Форма может быть сброшена с помощью кнопки Reset
 *    - Обработка ошибок реализована через try-catch и отображение toast-уведомлений
 */

import { Card } from '@/components/ui/card';
import { JSX, useCallback, useState } from 'react';
import { useAxios } from '@/shared/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NumberFactsFormValues, numberFactsSchema } from '@/app/projects/easy/number-facts/utils';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { TbCopy } from 'react-icons/tb';
import { HELPERS } from '@/shared';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

/**
 * Компонент страницы с фактами о числах.
 *
 * Позволяет пользователю ввести число и получить интересный факт о нем
 * через API numbersapi.com. Включает валидацию ввода, обработку ошибок
 * и возможность копирования полученного факта.
 *
 * @returns {JSX.Element} Компонент страницы с формой и отображением фактов о числах
 */
const NumberFactsPage = (): JSX.Element => {
  /**
   * Состояние для отслеживания процесса получения данных.
   * Используется для определения, был ли отправлен запрос.
   */
  const [fetchingData, setFetchingData] = useState<string | null>(null);

  /**
   * Хук для выполнения HTTP-запросов с управлением состоянием загрузки и ошибок.
   * - data: полученный факт о числе
   * - loading: состояние загрузки
   * - fetchData: функция для выполнения запроса
   * - error: информация об ошибке, если запрос не удался
   */
  const { data: fact, loading, fetchData, error } = useAxios<string>();

  /**
   * Настройка формы с использованием react-hook-form и валидацией через zod.
   * Валидация происходит при изменении значений (mode: 'onChange').
   */
  const form = useForm<NumberFactsFormValues>({
    resolver: zodResolver(numberFactsSchema),
    mode: 'onChange',
    defaultValues: {
      number: '',
    },
  });

  /**
   * Обработчик отправки формы.
   * Выполняет запрос к API для получения факта о введенном числе.
   *
   * @param {NumberFactsFormValues} data - Данные формы с введенным числом
   */
  const onSubmit = useCallback(async (data: NumberFactsFormValues) => {
    try {
      setFetchingData(await fetchData(`http://numbersapi.com/${data.number}`));
    } catch (error) {
      toast('An error occurred while fetching the number fact');
      console.error('An error occurred:', error);
    } finally {
      form.reset();
    }
  }, [fetchData, form]);

  /**
   * Обработчик сброса формы.
   * Очищает форму и сбрасывает состояние полученных данных.
   */
  const handleResetForm = useCallback(() => {
    form.reset();
    setFetchingData(null);
  }, [form]);

  return (
    <Card className="grid gap-2 max-w-sm w-full mx-auto p-4 rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormInput form={form} name="number" placeholder="Enter a number (from 1 to 300)" />
          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Get Fact
          </Button>
          {!loading && fetchingData && (
            <Button
              type="reset"
              variant="destructive"
              className="w-full"
              onClick={handleResetForm}
            >
              Reset
            </Button>
          )}
        </form>
      </Form>

      {/* Отображение факта о числе, если он получен */}
      {!loading && fetchingData && fact && (
        <div className="flex items-start gap-2">
          <span className="font-medium">{fact}</span>
          <Button
            variant="outline"
            className="p-2"
            onClick={() => HELPERS.copyToClipboard(fact)}
            aria-label="Copy fact to clipboard"
          >
            <TbCopy size={30} />
          </Button>
        </div>
      )}

      {/* Отображение сообщения об ошибке при неудачном запросе */}
      {error && (
        <p className="text-center text-gray-500">
          An error occurred while fetching the number fact.
        </p>
      )}

      {/* Отображение индикатора загрузки */}
      {loading && (<Spinner />)}
    </Card>
  );
};

export default NumberFactsPage;