'use client';

/**
 * # Приложение для поиска новостей Hacker News
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация:**
 *    - Приложение использует React с хуками состояния и эффектов.
 *    - Используется Redux для управления глобальным состоянием.
 *    - Форма поиска управляется с помощью react-hook-form и валидируется с использованием Zod.
 *
 * 2. **Поиск новостей:**
 *    - Пользователь вводит поисковый запрос в форму.
 *    - При отправке формы выполняется асинхронный запрос к API Hacker News.
 *    - Результаты поиска сохраняются в Redux store.
 *
 * 3. **Отображение результатов:**
 *    - Новости отображаются в виде сетки карточек.
 *    - Каждая карточка содержит заголовок (ссылку на новость), количество очков, автора и количество комментариев.
 *    - Реализована пагинация для навигации по результатам поиска.
 *
 * 4. **Управление новостями:**
 *    - Пользователь может удалить отдельную новость из списка.
 *    - Перед удалением показывается диалог подтверждения.
 *
 * 5. **Обработка состояний:**
 *    - Во время загрузки отображается спиннер.
 *    - При возникновении ошибки показывается соответствующее сообщение.
 *    - Успешные результаты поиска отображаются в виде списка.
 *
 * 6. **Дополнительные функции:**
 *    - Реализованы контролы для управления пагинацией и сортировкой.
 *    - Используются компоненты UI библиотеки для создания согласованного интерфейса.
 *
 * Приложение предоставляет удобный интерфейс для поиска и просмотра новостей с Hacker News,
 * с возможностью управления результатами и адаптивным дизайном.
 */

import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { JSX, useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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
import { Spinner } from '@/components/ui/spinner';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/hacker-news-search/app';
import {
  Hint,
  removeNews,
  resetPage,
  selectHackerNewsData,
  setNews,
  setQuery,
  useGetQuery,
  useLazyGetQuery,
} from '@/app/projects/medium/hacker-news-search/features';
import { FormSchema, formSchema } from '@/app/projects/medium/hacker-news-search/utils';
import { toast } from 'sonner';
import { FormInput } from '@/components/layout';
import { Controls } from '@/app/projects/medium/hacker-news-search/components';

/**
 * Компонент страницы поиска новостей Hacker News.
 * @returns {JSX.Element} Отрендеренная страница поиска новостей.
 */
const HackerNewsSearchPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [currentQuery, setCurrentQuery] = useState('react');
  const { page, hits: news } = useAppSelector(selectHackerNewsData);
  const { data, isError, isSuccess, isLoading } = useGetQuery({ query: currentQuery, page });
  const [searchNews] = useLazyGetQuery();

  /**
   * Инициализация формы с использованием react-hook-form и Zod для валидации.
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
    },
  });

  /**
   * Эффект для обновления новостей при успешном получении данных.
   */
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setNews(data));
    }
  }, [data, dispatch, isSuccess]);

  /**
   * Эффект для обновления текущего запроса в Redux store.
   */
  useEffect(() => {
    dispatch(setQuery(currentQuery));
  }, [currentQuery, dispatch]);

  /**
   * Обработчик отправки формы поиска.
   * @param {FormSchema} param0 - Объект с данными формы.
   */
  const onSubmit = useCallback(async ({ search }: FormSchema) => {
    try {
      setCurrentQuery(search);
      dispatch(resetPage());
      const result = await searchNews({ query: search, page: 0 }).unwrap();
      dispatch(setNews(result));
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to search Hacker News', { richColors: true });
    }
  }, [searchNews, dispatch]);

  return (
    <Card className="grid gap-4 p-2">
      {/* Форма поиска */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2.5">
          <FormInput
            form={form}
            name="search"
            label="Search by query:"
            placeholder="Search for a query..."
          />
          <Button className="max-w-max" type="submit">Search</Button>
        </form>
      </Form>

      {/* Контролы для пагинации и сортировки */}
      <Controls />

      {/* Индикатор загрузки */}
      {isLoading && <Spinner />}

      {/* Сообщение об ошибке */}
      {isError && <p className="text-center font-semibold">An error occurred while fetching the news.</p>}

      {/* Список новостей */}
      {isSuccess && news && (
        <ul className="grid gap-4 md:grid-cols-2">
          {news.map((hint: Hint) => (
            <li key={hint.objectID}>
              <Card className="grid gap-2 shadow border rounded p-3 dark:bg-accent">
                <h3 className="font-medium inline-flex gap-2 items-center justify-between">
                  <Link target="_blank" rel="noopener noreferrer" href={hint.url}>{hint.title}</Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <Trash2 className="text-red-400" size={32} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete news.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => dispatch(removeNews(hint.objectID))}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </h3>
                <p className='text-sm'>{hint.points} points by <span>{hint.author} | </span> {hint.num_comments} comments</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default HackerNewsSearchPage;