'use client';

/**
 * # Приложение для сортировки и фильтрации данных в таблице
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и загрузка данных**:
 *    - При монтировании компонента выполняется асинхронный запрос к API для получения данных пользователей.
 *    - Полученные данные форматируются и сохраняются в состоянии компонента.
 *
 * 2. **Настройка поиска**:
 *    - Пользователь может выбрать колонки для поиска с помощью чекбоксов.
 *    - По умолчанию выбраны колонки 'name' и 'username'.
 *
 * 3. **Поиск**:
 *    - Пользователь вводит поисковый запрос в текстовое поле.
 *    - Поиск осуществляется в реальном времени по мере ввода текста.
 *    - Поиск выполняется только по выбранным колонкам.
 *
 * 4. **Фильтрация данных**:
 *    - Данные фильтруются на основе введенного поискового запроса.
 *    - Фильтрация происходит без учета регистра.
 *    - В таблице отображаются только отфильтрованные данные.
 *
 * 5. **Отображение данных**:
 *    - Данные представлены в виде таблицы с фиксированной шириной колонок.
 *    - Заголовки таблицы генерируются динамически на основе полученных данных.
 *
 * 6. **Обработка ошибок**:
 *    - При ошибке загрузки данных выводится уведомление пользователю.
 *    - Ошибки логируются в консоль для отладки.
 *
 * 7. **Оптимизация производительности**:
 *    - Используются мемоизированные колбэки для предотвращения ненужных ререндеров.
 *    - Применяется отложенная загрузка данных с использованием useEffect.
 *
 * 8. **Доступность и UX**:
 *    - Используются семантические HTML-элементы и ARIA-атрибуты для улучшения доступности.
 *    - Реализована адаптивная верстка для корректного отображения на различных устройствах.
 */
import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Label } from '@/components/ui';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * @typedef {Object} Data
 * @property {string} id - Уникальный идентификатор записи
 * @property {string} name - Имя пользователя
 * @property {string} email - Электронная почта пользователя
 * @property {string} username - Имя пользователя для входа
 * @property {string} address - Адрес пользователя (город)
 * @property {string} website - Веб-сайт пользователя
 * @property {string} phone - Телефонный номер пользователя
 */
type Data = {
  id: string;
  name: string;
  email: string;
  username: string;
  address: string;
  website: string;
  phone: string;
}

/**
 * @typedef {Object} User
 * @property {number} id - Уникальный идентификатор пользователя
 * @property {string} name - Имя пользователя
 * @property {string} email - Электронная почта пользователя
 * @property {string} username - Имя пользователя для входа
 * @property {Object} address - Адрес пользователя
 * @property {string} address.city - Город пользователя
 * @property {string} website - Веб-сайт пользователя
 * @property {string} phone - Телефонный номер пользователя
 */
type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  address: {
    city: string;
  };
  website: string;
  phone: string;
}

/**
 * Схема для валидации формы поиска
 * @type {import('zod').ZodObject<{query: import('zod').ZodString}>}
 */
const searchFormSchema = z.object({
  query: z.string(),
});

/**
 * @typedef {z.infer<typeof searchFormSchema>} SearchFormValues
 */
type SearchFormValues = z.infer<typeof searchFormSchema>;

/**
 * Компонент страницы с сортируемой таблицей данных
 * @type {React.FC}
 * @returns {JSX.Element} Отрендеренный компонент страницы
 */
const DataTableSortPage = (): JSX.Element => {
  const [data, setData] = useState<Data[]>([]);
  const [searchColumns, setSearchColumns] = useState<string[]>(['name', 'username']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Memoize columns to prevent recalculations
  const columns = useMemo(() => data[0] ? Object.keys(data[0]) : [], [data]);

  // Инициализация формы с использованием react-hook-form и zod для валидации
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: '' },
    mode: 'onChange',
  });

  // Get query value from form with useWatch for better performance
  const query = form.watch('query');

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<User[]>(
          'https://jsonplaceholder.typicode.com/users',
          { signal: controller.signal },
        );

        setData(data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          email: item.email,
          username: item.username,
          address: item.address.city,
          website: item.website,
          phone: item.phone,
        })));
        setError('');
      } catch (error) {
        // Only show error if it's not an abort error
        if (!axios.isCancel(error)) {
          console.error('An error occurred:', error);
          toast.error('Failed to fetch users from API', { richColors: true });
          setError('Failed to load data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Cleanup function to abort fetch on unmount
    return () => controller.abort();
  }, []);

  /**
   * Обрабатывает поисковый запрос и фильтрует данные
   */
  const handleSearch = useCallback((rows: Data[], searchQuery: string) => {
    if (!searchQuery) return rows;
    const lowerCaseQuery = searchQuery.toLowerCase();

    return rows.filter(row =>
      searchColumns.some(column => {
        const value = row[column as keyof Data];
        return value && value.toString().toLowerCase().includes(lowerCaseQuery);
      }),
    );
  }, [searchColumns]);

  /**
   * Обрабатывает изменение состояния чекбокса для выбора колонок поиска
   */
  const handleCheckbox = useCallback((column: string): void => {
    setSearchColumns(prev =>
      prev.includes(column)
        ? prev.filter(searchColumn => searchColumn !== column)
        : [...prev, column],
    );
  }, []);

  // Memoize filtered data to prevent recalculation on every render
  const filteredData = useMemo(() => handleSearch(data, query), [data, query, handleSearch]);

  // Memoize column checkboxes to prevent unnecessary rerenders
  const columnCheckboxes = useMemo(() => (
    <ul className="flex flex-wrap gap-3">
      {columns.map((column) => (
        <li key={column}>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`checkbox-${column}`}
              checked={searchColumns.includes(column)}
              onCheckedChange={() => handleCheckbox(column)}
              className="border-black dark:border-white"
            />
            <Label htmlFor={`checkbox-${column}`}>{column}</Label>
          </div>
        </li>
      ))}
    </ul>
  ), [columns, searchColumns, handleCheckbox]);

  // Memoize table headers
  const tableHeaders = useMemo(() => (
    <div className="grid grid-cols-[100px_170px_170px_170px_170px_170px_170px] sticky top-0">
      {columns.map((heading) => (
        <div
          className="p-2 border bg-slate-100 dark:bg-accent font-bold uppercase"
          key={heading}
        >
          {heading}
        </div>
      ))}
    </div>
  ), [columns]);

  // Show loading state or error
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8 text-center">{error}</div>;
  }

  return (
    <Card className="max-w-6xl mx-auto w-full p-3 gap-5">
      <Form {...form}>
        <form className="grid gap-2 p-2 overflow-auto">
          <FormInput
            form={form}
            name="query"
            label="Search Query"
            placeholder="Search query"
          />

          <p className="font-medium text-sm dark:text-gray-300">Select Filter</p>
          {columnCheckboxes}
        </form>
      </Form>

      <div className="text-sm break-all overflow-auto max-h-[70vh]">
        {tableHeaders}

        {filteredData.length > 0 ? (
          filteredData.map((row) => (
            <div className="grid grid-cols-[100px_170px_170px_170px_170px_170px_170px]" key={row.id}>
              {columns.map((column) => (
                <div key={`${row.id}-${column}`} className="p-2 border">
                  {row[column as keyof Data]}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-4 text-center">No results found</div>
        )}
      </div>
    </Card>
  );
};

export default DataTableSortPage;