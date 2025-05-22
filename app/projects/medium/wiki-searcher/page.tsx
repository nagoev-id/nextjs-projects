'use client';

/**
 * # Приложение для поиска в Википедии
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация и настройка**:
 *    - Приложение использует RTK Query для управления состоянием запросов к API Википедии
 *    - Форма поиска настроена с использованием React Hook Form и Zod для валидации
 *    - Состояние загрузки, ошибок и результатов управляется через хук useLazySearchWikiQuery
 * 
 * 2. **Процесс поиска**:
 *    - Пользователь вводит поисковый запрос в текстовое поле
 *    - При отправке формы выполняется валидация введенных данных
 *    - Если валидация успешна, выполняется запрос к API Википедии
 *    - Во время загрузки отображается индикатор (спиннер)
 *    - После получения результатов форма сбрасывается
 * 
 * 3. **Обработка результатов**:
 *    - При успешном поиске результаты отображаются в виде сетки карточек
 *    - Каждая карточка содержит заголовок и фрагмент текста из статьи
 *    - Текст очищается от потенциально опасного HTML с помощью DOMPurify
 *    - Карточки являются ссылками на соответствующие статьи в Википедии
 * 
 * 4. **Обработка ошибок**:
 *    - При возникновении ошибки во время запроса показывается уведомление
 *    - Ошибка логируется в консоль для отладки
 *    - Пользователю отображается сообщение об ошибке
 * 
 * 5. **Адаптивный дизайн**:
 *    - Интерфейс адаптируется к различным размерам экрана
 *    - На мобильных устройствах результаты отображаются в один столбец
 *    - На планшетах - в два столбца, на десктопах - в три столбца
 * 
 * 6. **Доступность**:
 *    - Кнопка поиска отображает текущее состояние (поиск/готов к поиску)
 *    - Кнопка блокируется во время выполнения запроса
 *    - Все интерактивные элементы имеют соответствующие атрибуты для скринридеров
 */

import { Card } from '@/components/ui/card';
import { SiWikipedia } from 'react-icons/si';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSX, useCallback } from 'react';
import { useLazySearchWikiQuery } from './features';
import { validate, ValidateSchema } from '@/app/projects/medium/wiki-searcher/utils';
import { FormInput } from '@/components/layout';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';

/**
 * Тип для результата поиска в Википедии
 * 
 * @typedef {Object} WikiSearchResult
 * @property {string} title - Заголовок статьи
 * @property {number} pageid - Уникальный идентификатор страницы в Википедии
 * @property {string} snippet - HTML-фрагмент текста статьи с выделенными совпадениями
 */
type WikiSearchResult = {
  title: string;
  pageid: number;
  snippet: string;
}

/**
 * Компонент страницы поиска в Википедии
 * 
 * Предоставляет интерфейс для поиска статей в Википедии с отображением результатов
 * в виде карточек со ссылками на полные статьи. Использует RTK Query для управления
 * состоянием запросов и React Hook Form для управления формой.
 * 
 * @returns {JSX.Element} Компонент страницы поиска в Википедии
 */
const WikiSearcherPage = (): JSX.Element => {
  /**
   * Хук для выполнения поискового запроса к API Википедии
   * Возвращает функцию запроса и объект с состоянием и результатами
   */
  const [searchByQuery, { isLoading, isError, isSuccess, data: searchResults }] = useLazySearchWikiQuery();
  
  /**
   * Настройка формы с валидацией через React Hook Form и Zod
   */
  const form = useForm<ValidateSchema>({
    resolver: zodResolver(validate),
    defaultValues: { query: '' },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы поиска
   * Выполняет запрос к API Википедии и обрабатывает результаты
   * 
   * @param {ValidateSchema} param0 - Объект с валидированными данными формы
   * @param {string} param0.query - Поисковый запрос
   * @returns {Promise<void>}
   */
  const onSubmit = useCallback(async ({ query }: ValidateSchema): Promise<void> => {
    try {
      // Выполнение запроса к API с использованием RTK Query
      await searchByQuery(query).unwrap();
    } catch (error) {
      // Обработка ошибок запроса
      console.error('An error occurred:', error);
      toast.error('Failed to search Wikipedia', { richColors: true });
    } finally {
      // Сброс формы независимо от результата
      form.reset();
    }
  }, [form, searchByQuery]);

  /**
   * Проверка наличия результатов поиска для упрощения условий рендеринга
   */
  const hasResults = isSuccess && searchResults && searchResults.length > 0;

  return (
    <div className="grid gap-3">
      {/* Карточка с формой поиска */}
      <Card className="max-w-sm w-full mx-auto p-4 rounded">
        {/* Логотип Википедии */}
        <SiWikipedia className="mx-auto" size={40} aria-hidden="true" />

        {/* Форма поиска */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 items-end">
            <FormInput 
              form={form} 
              name="query" 
              label="Enter search query" 
              placeholder="Car" 
              autoComplete="off"
              disabled={isLoading}
            />
            <div className="inline-flex gap-2">
              <Button 
                className="w-full" 
                type="submit" 
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <div>
        {/* Индикатор загрузки */}
        {isLoading && <Spinner>Loading search results...</Spinner>}

        {/* Сообщение об ошибке */}
        {isError && (
          <p className="text-center text-red-500 font-medium mt-4" role="alert">
            Failed to search Wikipedia
          </p>
        )}

        {/* Результаты поиска */}
        {hasResults && (
          <ul 
            className="grid gap-3 sm:grid-cols-2 md:grid-cols-3" 
            aria-label="Search results"
          >
            {searchResults.map(({ title, pageid, snippet }: WikiSearchResult) => (
              <li key={pageid} className="rounded border bg-white p-3 dark:bg-accent">
                <a 
                  className="grid gap-2" 
                  href={`https://en.wikipedia.org/?curid=${pageid}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read full article about ${title}`}
                >
                  <h4 className="text-lg font-bold uppercase">{title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(snippet) }} />
                </a>
              </li>
            ))}
          </ul>
        )}
        
        {/* Сообщение об отсутствии результатов */}
        {isSuccess && (!searchResults || searchResults.length === 0) && (
          <p className="text-center mt-4" role="status">
            No results found. Try a different search query.
          </p>
        )}
      </div>
    </div>
  );
};

export default WikiSearcherPage;