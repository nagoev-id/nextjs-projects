'use client';

/**
 * # Приложение для поиска книг (Book Hub)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка формы**:
 *    - Приложение использует React Hook Form с Zod для валидации поискового запроса
 *    - Форма настроена на режим валидации при изменении ('onChange')
 *    - По умолчанию поле поиска пустое
 *
 * 2. **Поиск книг**:
 *    - Пользователь вводит поисковый запрос в текстовое поле
 *    - При отправке формы выполняется запрос к API с использованием RTK Query
 *    - Во время поиска отображается индикатор загрузки (Spinner)
 *
 * 3. **Отображение результатов**:
 *    - Результаты поиска отображаются в виде сетки карточек книг
 *    - Сетка адаптивно меняется в зависимости от размера экрана (от 1 до 4 колонок)
 *    - Каждая карточка содержит основную информацию о книге
 *    - Над результатами отображается поисковый запрос в нижнем регистре
 *
 * 4. **Обработка ошибок**:
 *    - При ошибке API запроса пользователю показывается уведомление
 *    - Ошибки логируются в консоль для отладки
 *    - Отображается информативное сообщение об ошибке в интерфейсе
 *
 * 5. **Состояния интерфейса**:
 *    - Загрузка: отображается компонент Spinner
 *    - Ошибка: показывается сообщение об ошибке
 *    - Успех: отображаются найденные книги в виде сетки
 *    - Пустой результат: не отображается секция результатов
 *
 * 6. **Оптимизация производительности**:
 *    - Функция отправки формы мемоизирована с помощью useCallback
 *    - Используется ленивый запрос (useLazyGetByNameQuery) для выполнения поиска только при необходимости
 *    - Компоненты книг рендерятся с уникальными ключами для оптимизации обновлений DOM
 *
 * 7. **Пользовательский опыт**:
 *    - Понятный интерфейс с четкими подсказками
 *    - Мгновенная обратная связь о состоянии запроса
 *    - Адаптивный дизайн для различных устройств
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { JSX, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useLazyGetByNameQuery } from '@/app/projects/medium/book-hub/features';
import { FormSchema, formSchema } from '@/app/projects/medium/book-hub/utils';
import { toast } from 'sonner';
import { Button, Card, Form, Spinner } from '@/components/ui';
import { FormInput } from '@/components/layout';
import { Book } from '@/app/projects/medium/book-hub/components';

/**
 * @fileoverview Компонент страницы поиска книг Book Hub.
 * @description Этот компонент реализует функциональность поиска книг с использованием
 * React Hook Form для управления формой и RTK Query для выполнения API-запросов.
 */

/**
 * Компонент страницы Book Hub.
 * @type {React.FC}
 * @returns {JSX.Element} Отрендеренный компонент страницы Book Hub.
 *
 * @description
 * Этот компонент отображает форму поиска книг и результаты поиска.
 * Он использует:
 * - React Hook Form с Zod для валидации формы
 * - RTK Query для выполнения API-запросов
 * - Адаптивный дизайн для отображения результатов
 *
 * Основные функции:
 * - Поиск книг по запросу пользователя
 * - Отображение результатов в виде сетки карточек
 * - Обработка состояний загрузки и ошибок
 */
const BookHubPage = (): JSX.Element => {
  /**
   * Хук для выполнения ленивого запроса поиска книг.
   * @type {[Function, Object]} Кортеж, содержащий функцию запроса и объект с результатами.
   */
  const [searchByQuery, { isError, isLoading, isSuccess, data: books }] = useLazyGetByNameQuery();

  /**
   * Конфигурация формы с использованием React Hook Form.
   * @type {<FormSchema>}
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы поиска.
   * @function
   * @param {FormSchema} param0 - Объект с данными формы.
   * @param {string} param0.query - Поисковый запрос.
   * @returns {Promise<void>}
   *
   * @description
   * Выполняет поиск книг по введенному запросу.
   * В случае ошибки выводит сообщение в консоль и показывает уведомление пользователю.
   *
   * @example
   * form.handleSubmit(onSubmit)
   */
  const onSubmit = useCallback(async ({ query }: FormSchema) => {
    try {
      await searchByQuery(query).unwrap();
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to search for authors', { richColors: true });
    }
  }, [searchByQuery]);

  return (
    <Card className="max-w-6xl grid gap-3 w-full mx-auto p-4 rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2.5">
          <FormInput
            name="query"
            placeholder="Enter search query"
            label="Find your Book Of Choice"
            form={form}
          />
          <Button type="submit">Search</Button>
        </form>
      </Form>
      {/* Loading */}
      {isLoading && <Spinner />}
      {/* Error */}
      {isError && <p>Error fetching books. Please try again later.</p>}
      {/* Success */}
      {isSuccess && books.length > 0 && (
        <div className="grid gap-3">
          <h2 className="text-xl font-semibold">Search Results for: {form.getValues('query').toLowerCase()} </h2>
          <ul className="grid items-start gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map(book => <Book key={book.id} book={book} isHome />)}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default BookHubPage;