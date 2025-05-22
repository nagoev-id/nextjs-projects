'use client';

/**
 * # Приложение для поиска в Википедии
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка**:
 *    - Приложение использует React с хуками состояния для управления данными поиска
 *    - Форма поиска настроена с использованием React Hook Form и Zod для валидации
 *    - Состояние загрузки, ошибок и результатов управляется через локальное состояние
 *
 * 2. **Процесс поиска**:
 *    - Пользователь вводит поисковый запрос в текстовое поле
 *    - При отправке формы выполняется валидация введенных данных
 *    - Если валидация успешна, выполняется запрос к API Википедии через axios
 *    - Во время загрузки отображается индикатор (спиннер) и блокируется кнопка поиска
 *    - После получения результатов форма сбрасывается и обновляется состояние приложения
 *
 * 3. **Обработка результатов**:
 *    - При успешном поиске результаты отображаются в виде сетки карточек
 *    - Каждая карточка содержит заголовок и фрагмент текста из статьи
 *    - Текст очищается от потенциально опасного HTML с помощью DOMPurify
 *    - Карточки являются ссылками на соответствующие статьи в Википедии
 *    - Появляется кнопка для очистки результатов поиска
 *
 * 4. **Обработка ошибок**:
 *    - При возникновении ошибки во время запроса показывается уведомление
 *    - Ошибка логируется в консоль для отладки
 *    - Пользователю отображается сообщение об ошибке
 *
 * 5. **Управление состоянием**:
 *    - Состояние поиска (загрузка/ошибка/успех) хранится в объекте status
 *    - Результаты поиска хранятся в отдельном состоянии searchResults
 *    - Функция handleClearResults позволяет очистить результаты поиска
 *
 * 6. **Адаптивный дизайн**:
 *    - Интерфейс адаптируется к различным размерам экрана
 *    - На мобильных устройствах результаты отображаются в один столбец
 *    - На планшетах - в два столбца, на десктопах - в три столбца
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSX, useCallback, useState } from 'react';
import { validate, ValidateSchema } from '@/app/projects/medium/wiki-searcher/utils';
import { toast } from 'sonner';
import { SiWikipedia } from 'react-icons/si';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { Button, Card, Form, Spinner } from '@/components/ui';
import { FormInput } from '@/components/layout';

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
 * Тип для отслеживания состояния поиска
 *
 * @typedef {Object} SearchStatus
 * @property {boolean} isLoading - Флаг, указывающий на выполнение запроса
 * @property {boolean} isError - Флаг, указывающий на наличие ошибки
 * @property {boolean} isSuccess - Флаг, указывающий на успешное выполнение запроса
 */
type SearchStatus = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Компонент страницы поиска в Википедии
 *
 * Предоставляет интерфейс для поиска статей в Википедии с отображением результатов
 * в виде карточек со ссылками на полные статьи. Использует axios для выполнения запросов
 * к API Википедии и React Hook Form для управления формой.
 *
 * @returns {JSX.Element} Компонент страницы поиска в Википедии
 */
const WikiSearcherPage = (): JSX.Element => {
  /**
   * Состояние для хранения результатов поиска
   */
  const [searchResults, setSearchResults] = useState<WikiSearchResult[]>([]);

  /**
   * Состояние для отслеживания статуса поиска (загрузка/ошибка/успех)
   */
  const [status, setStatus] = useState<SearchStatus>({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  /**
   * Настройка формы с валидацией через React Hook Form и Zod
   */
  const form = useForm<ValidateSchema>({
    resolver: zodResolver(validate),
    defaultValues: { query: '' },
    mode: 'onChange',
  });

  /**
   * Обработчик очистки результатов поиска
   * Сбрасывает результаты и обновляет статус
   */
  const handleClearResults = useCallback(() => {
    setSearchResults([]);
    setStatus(prev => ({ ...prev, isSuccess: false }));
  }, []);

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
      // Устанавливаем состояние загрузки
      setStatus({ isLoading: true, isError: false, isSuccess: false });

      // Выполняем запрос к API Википедии
      const { data } = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srlimit: 20,
          format: 'json',
          origin: '*',
          srsearch: query,
        },
      });

      // Обновляем состояние с результатами и статусом
      setSearchResults(data.query.search);
      setStatus({ isLoading: false, isError: false, isSuccess: true });
      form.reset();
    } catch (error) {
      // Обработка ошибок запроса
      console.error('An error occurred:', error);
      toast.error('Failed to search Wikipedia', { richColors: true });
      setStatus({ isLoading: false, isError: true, isSuccess: false });
    }
  }, [form]);

  /**
   * Проверка наличия результатов поиска для упрощения условий рендеринга
   */
  const hasResults = status.isSuccess && searchResults.length > 0;

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
              disabled={status.isLoading}
              aria-label="Search Wikipedia"
            />
            <div className="grid gap-2">
              <Button
                className="w-full"
                type="submit"
                disabled={status.isLoading}
                aria-busy={status.isLoading}
              >
                {status.isLoading ? 'Searching...' : 'Search'}
              </Button>
              {hasResults && (
                <Button
                  variant="destructive"
                  className="w-full"
                  type="button"
                  onClick={handleClearResults}
                  aria-label="Clear search results"
                >
                  Clear search results
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>

      <div>
        {/* Индикатор загрузки */}
        {status.isLoading && <Spinner>Loading search results...</Spinner>}

        {/* Сообщение об ошибке */}
        {status.isError && (
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
        {status.isSuccess && searchResults.length === 0 && (
          <p className="text-center mt-4" role="status">
            No results found. Try a different search query.
          </p>
        )}
      </div>
    </div>
  );
};

export default WikiSearcherPage;