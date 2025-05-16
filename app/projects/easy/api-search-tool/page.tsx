'use client';

/**
 * # API Search Tool
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация данных**:
 *    - Приложение загружает предопределенные списки API и категорий из JSON файлов
 *    - Данные API группируются по категориям для быстрого доступа
 *
 * 2. **Поиск API**:
 *    - Пользователь может искать API по ключевым словам через поисковую форму
 *    - Поиск осуществляется по названию API, описанию и категории
 *    - Результаты отображаются в виде карточек с информацией о каждом API
 *
 * 3. **Фильтрация по категориям**:
 *    - Пользователь может выбрать конкретную категорию из списка доступных категорий
 *    - При выборе категории отображаются только API, относящиеся к этой категории
 *
 * 4. **Обработка состояний**:
 *    - Приложение отслеживает различные состояния: ожидание, загрузка, успех, ошибка
 *    - В зависимости от состояния отображается соответствующий интерфейс
 *
 * 5. **Уведомления**:
 *    - Пользователь получает уведомления об успешном поиске или ошибках
 *    - Уведомления реализованы с помощью библиотеки toast
 */

import { ChangeEvent, FormEvent, JSX, useCallback, useState } from 'react';
import CATEGORIES from './mock/categories.json';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiEntry } from '@/app/projects/easy/api-search-tool/types';
import { categorizedResults, filterResults } from './utils';


/**
 * Тип для элемента категории
 * @property {string} name - Название категории
 * @property {string} slug - Уникальный идентификатор категории
 */
type CategoryEntry = {
  name: string;
  slug: string;
}

/**
 * Тип для состояния загрузки данных
 * idle - начальное состояние
 * loading - загрузка данных
 * success - данные успешно загружены
 * error - ошибка при загрузке данных
 */
type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Компонент инструмента поиска API
 * Позволяет искать API по ключевым словам и фильтровать по категориям
 *
 * @returns {JSX.Element} Компонент страницы инструмента поиска API
 */
const APISearchToolPage = (): JSX.Element => {
  // Состояние для хранения текущего поискового запроса
  const [query, setQuery] = useState<string>('');

  // Состояние для хранения результатов поиска
  const [searchResults, setSearchResults] = useState<ApiEntry[]>([]);

  // Состояние для отслеживания статуса загрузки
  const [status, setStatus] = useState<Status>('idle');

  // Состояние для хранения активной категории
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /**
   * Получает API по категории или поисковому запросу
   *
   * @param {string} searchQuery - Поисковый запрос или название категории
   * @param {boolean} isSearchForm - Флаг, указывающий, что запрос идет из формы поиска
   * @returns {Promise<ApiEntry[]>} Промис с результатами поиска
   */
  const fetchCategories = useCallback(async (searchQuery: string, isSearchForm = false): Promise<ApiEntry[]> => {
    setStatus('loading');

    try {
      // Получаем категоризированные результаты
      const categorized = categorizedResults();

      // Используем filterResults с правильными параметрами или получаем результаты по категории
      const results = isSearchForm
        ? filterResults(searchQuery, categorized)
        : categorized[searchQuery] || [];

      setActiveCategory(isSearchForm ? null : searchQuery);
      setSearchResults(results);
      setStatus('success');

      return results;
    } catch (error) {
      console.error('Error getting categories:', error);
      setStatus('error');
      return [];
    }
  }, []);

  /**
   * Обработчик изменения поискового запроса
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения поля ввода
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  }, []);

  /**
   * Обработчик отправки формы поиска
   * Выполняет поиск по введенному запросу и отображает уведомления о результате
   *
   * @param {FormEvent<HTMLFormElement>} event - Событие отправки формы
   */
  const handleFormSubmit = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!query || query.trim().length === 0) {
      toast.error('Please enter a search query.', {
        richColors: true,
      });
      return;
    }

    const results = await fetchCategories(query.trim(), true);

    if (results.length > 0) {
      toast.success('Search completed successfully');
    } else {
      toast.error('No results found for your query.', {
        richColors: true,
      });
    }
  }, [query, fetchCategories]);

  /**
   * Обработчик выбора категории
   *
   * @param {string} category - Название выбранной категории
   */
  const handleGetCategory = useCallback((category: string): void => {
    fetchCategories(category);
  }, [fetchCategories]);

  /**
   * Рендерит список API в виде карточек
   *
   * @returns {JSX.Element} Список API
   */
  const renderApiList = useCallback((): JSX.Element => (
    <ul className="grid gap-3 place-items-start sm:grid-cols-2 md:grid-cols-3">
      {searchResults.map(({ API, Link: ApiLink, Description, Auth, Cors, Category }: ApiEntry, index: number) => (
        <li className="w-full h-full" key={`${API}-${Category}-${index}`}>
          <Card className="rounded p-2 border-2 h-full w-full">
            <Link href={ApiLink} target="_blank" rel="noopener noreferrer">
              {[
                { key: API, label: 'Title' },
                { key: Description, label: 'Description' },
                { key: Auth, label: 'Authentication' },
                { key: Cors, label: 'CORS' },
                { key: Category, label: 'Category' },
              ].map(({ key, label }) => (
                <p key={label}>
                  <span className="font-bold">{label}:</span>{' '}
                  <span>{key || '-'}</span>
                </p>
              ))}
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  ), [searchResults]);

  /**
   * Рендерит содержимое в зависимости от текущего статуса
   *
   * @returns {JSX.Element | null} Содержимое для текущего статуса
   */
  const renderStatusContent = (): JSX.Element | null => {
    switch (status) {
      case 'loading':
        return <Spinner />;
      case 'error':
        return <p className="text-center text-red-500">An error occurred while retrieving data.</p>;
      case 'success':
        return searchResults.length > 0 ? (
          <Card className="border-2 rounded-md p-3 border-none shadow-none gap-1">
            <h3 className="font-medium text-lg">List of APIs</h3>
            {renderApiList()}
          </Card>
        ) : (
          <p className="text-center">No results found.</p>
        );
      default:
        return null;
    }
  };
  return (
    // Основная карточка-контейнер для всего компонента
    <Card className="grid gap-2 max-w-6xl w-full mx-auto border-none shadow-none">
      <Card className="border-2 rounded-md p-3 space-y-1 gap-1">
        <h1 className="text-center text-2xl font-semibold">API Search</h1>

        <form onSubmit={handleFormSubmit}>
          <label>
            <Input
              value={query}
              onChange={handleSearchChange}
              name="category"
              placeholder="Enter keywords"
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </label>
        </form>

        <div className="space-y-2">
          <Card className="border-2 rounded-md p-3 border-none shadow-none">
            <h3 className="font-medium text-lg">
              Total categories:
              <span className="font-bold">{CATEGORIES.count}</span>
            </h3>

            <ul className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.entries.map(({ name, slug }: CategoryEntry) => (
                <li key={slug}>
                  <Button
                    variant={activeCategory === name ? 'secondary' : 'default'}
                    onClick={() => handleGetCategory(name)}
                  >
                    {name}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>

          {renderStatusContent()}
        </div>
      </Card>
    </Card>
  );
};

export default APISearchToolPage;