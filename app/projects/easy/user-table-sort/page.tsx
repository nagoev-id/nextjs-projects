'use client';

/**
 * # Сортируемая таблица пользователей
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация и состояние**:
 *    - Компонент использует локальное состояние для отслеживания ключа сортировки и порядка сортировки
 *    - По умолчанию таблица сортируется по фамилии в порядке возрастания
 * 
 * 2. **Сортировка данных**:
 *    - Пользователь может сортировать таблицу по любому столбцу, нажимая на заголовок
 *    - При повторном нажатии на тот же заголовок порядок сортировки меняется на противоположный
 *    - Визуальный индикатор (стрелка вверх/вниз) показывает текущий столбец и направление сортировки
 * 
 * 3. **Оптимизация производительности**:
 *    - Используется useMemo для предотвращения ненужных пересортировок данных
 *    - Компоненты заголовков и строк таблицы мемоизированы для предотвращения лишних рендеров
 *    - Функция изменения сортировки оптимизирована с помощью useCallback
 * 
 * 4. **Отображение данных**:
 *    - Данные представлены в виде таблицы с фиксированной шириной колонок
 *    - Заголовки таблицы содержат кнопки сортировки с визуальной индикацией
 *    - Используется компонент Badge для стилизации кнопок сортировки
 * 
 * 5. **Доступность**:
 *    - Кнопки сортировки имеют соответствующие ARIA-атрибуты
 *    - Используется семантическая разметка для лучшей поддержки скринридеров
 */

import { Card } from '@/components/ui/card';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { JSX, ReactNode, useCallback, useMemo, useState } from 'react';
import mockData from './mock/index.json';
import { Badge } from '@/components/ui';
import { FormInput } from '@/components/layout';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';

/**
 * Тип данных пользователя
 * @typedef {Object} Person
 * @property {number} id - Уникальный идентификатор пользователя
 * @property {string} first_name - Имя пользователя
 * @property {string} last_name - Фамилия пользователя
 * @property {string} email - Электронная почта пользователя
 * @property {string} gender - Пол пользователя
 * @property {string} ip_address - IP-адрес пользователя
 */
type Person = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}

/**
 * Тип порядка сортировки
 * @typedef {('asc'|'desc')} SortOrder
 */
type SortOrder = 'asc' | 'desc';

/**
 * Свойства компонента кнопки сортировки
 * @typedef {Object} ISortButtonProps
 * @property {ReactNode} children - Дочерние элементы кнопки
 * @property {keyof Person} columnKey - Ключ столбца для сортировки
 * @property {Function} onClick - Обработчик клика
 * @property {keyof Person} sortKey - Текущий ключ сортировки
 * @property {SortOrder} sortOrder - Текущий порядок сортировки
 */
type ISortButtonProps = {
  children: ReactNode;
  columnKey: keyof Person;
  onClick: () => void;
  sortKey: keyof Person;
  sortOrder: SortOrder;
}

/**
 * Схема для валидации формы поиска
 */
const searchFormSchema = z.object({
  query: z.string(),
});

/**
 * Тип значений формы поиска
 */
type SearchFormValues = z.infer<typeof searchFormSchema>;

/**
 * Сортирует данные таблицы по указанному ключу
 * 
 * @param {Person[]} tableData - Исходные данные таблицы
 * @param {keyof Person} sortKey - Ключ для сортировки
 * @param {boolean} reverse - Флаг обратной сортировки
 * @returns {Person[]} Отсортированные данные
 */
const sortData = (tableData: Person[], sortKey: keyof Person, reverse: boolean): Person[] => {
  if (!sortKey) return tableData;
  return [...tableData].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return reverse ? 1 : -1;
    if (a[sortKey] > b[sortKey]) return reverse ? -1 : 1;
    return 0;
  });
};

/**
 * Фильтрует данные таблицы по поисковому запросу
 * 
 * @param {Person[]} tableData - Исходные данные таблицы
 * @param {string} query - Поисковый запрос
 * @param {Array<keyof Person>} searchColumns - Колонки для поиска
 * @returns {Person[]} Отфильтрованные данные
 */
const filterData = (tableData: Person[], query: string, searchColumns: Array<keyof Person>): Person[] => {
  if (!query) return tableData;
  
  const lowerCaseQuery = query.toLowerCase();
  return tableData.filter(person => 
    searchColumns.some(column => 
      person[column].toString().toLowerCase().includes(lowerCaseQuery)
    )
  );
};

/**
 * Компонент кнопки сортировки
 * 
 * @param {ISortButtonProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент кнопки сортировки
 */
const SortButton = ({ sortOrder, columnKey, sortKey, onClick, children }: ISortButtonProps): JSX.Element => {
  const isActive = sortKey === columnKey;
  const isDescending = isActive && sortOrder === 'desc';

  return (
    <Badge 
      onClick={onClick} 
      className="flex items-center justify-between uppercase font-medium cursor-pointer"
      role="button"
      aria-pressed={isActive}
      aria-sort={isActive ? (isDescending ? 'descending' : 'ascending') : 'none'}
    >
      <span>{children}</span>
      {isActive && (<span className="ml-2">{isDescending ? <FiChevronDown /> : <FiChevronUp />}</span>)}
    </Badge>
  );
};

/**
 * Компонент страницы с сортируемой таблицей пользователей
 * 
 * @returns {JSX.Element} Компонент страницы
 */
const UserTableSortPage = (): JSX.Element => {
  // Состояние сортировки
  const [sortKey, setSortKey] = useState<keyof Person>('last_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Колонки для поиска по умолчанию
  const [searchColumns] = useState<Array<keyof Person>>(['first_name', 'last_name', 'email']);

  // Инициализация формы поиска
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: '' },
    mode: 'onChange',
  });

  // Получение значения поискового запроса
  const query = form.watch('query');

  // Заголовки таблицы
  const headers: { key: keyof Person; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'first_name', label: 'First name' },
    { key: 'last_name', label: 'Last name' },
    { key: 'email', label: 'Email' },
    { key: 'gender', label: 'Gender' },
    { key: 'ip_address', label: 'IP address' },
  ];

  // Мемоизация отфильтрованных и отсортированных данных
  const processedData = useMemo(() => {
    const filteredData = filterData(mockData, query, searchColumns);
    return sortData(filteredData, sortKey, sortOrder === 'desc');
  }, [sortKey, sortOrder, query, searchColumns]);

  // Обработчик изменения сортировки
  const handleChangeSort = useCallback((key: keyof Person) => {
    setSortOrder(prevOrder => key === sortKey && prevOrder === 'asc' ? 'desc' : 'asc');
    setSortKey(key);
  }, [sortKey]);

  // Мемоизация заголовков таблицы
  const tableHeaders = useMemo(() => (
    <div className="grid grid-cols-[70px_212px_212px_220px_180px_234px] bg-slate-50 dark:bg-slate-800">
      {headers.map(({ key, label }) => (
        <div
          className="p-2 border"
          key={key}>
          <SortButton
            columnKey={key}
            onClick={() => handleChangeSort(key)}
            sortOrder={sortOrder}
            sortKey={sortKey}
          >
            {label}
          </SortButton>
        </div>
      ))}
    </div>
  ), [headers, handleChangeSort, sortOrder, sortKey]);

  // Мемоизация строк таблицы
  const tableRows = useMemo(() => (
    <div>
      {processedData.map(({ id, first_name, last_name, email, gender, ip_address }) => (
        <div className="grid grid-cols-[70px_212px_212px_220px_180px_234px] text-sm" key={id}>
          <div className="p-2 border">{id}</div>
          <div className="p-2 border">{first_name}</div>
          <div className="p-2 border">{last_name}</div>
          <div className="p-2 border break-all">{email}</div>
          <div className="p-2 border">{gender}</div>
          <div className="p-2 border">{ip_address}</div>
        </div>
      ))}
    </div>
  ), [processedData]);

  return (
    <Card className="max-w-6xl mx-auto w-full p-3 grid gap-5">
      {/* Форма поиска */}
      <Form {...form}>
        <form className="grid gap-2">
          <FormInput
            form={form}
            name="query"
            label="Search Users"
            placeholder="Enter search query..."
            aria-label="Search users"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Searching in: {searchColumns.join(', ')}
          </p>
        </form>
      </Form>

      {/* Таблица */}
      <div className="overflow-auto" role="region" aria-label="Users table">
        {tableHeaders}
        
        {processedData.length > 0 ? (
          tableRows
        ) : (
          <div className="p-4 text-center">No users found matching your search criteria</div>
        )}
      </div>
      
      {/* Информация о количестве записей */}
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Showing {processedData.length} of {mockData.length} users
      </div>
    </Card>
  );
};

export default UserTableSortPage;