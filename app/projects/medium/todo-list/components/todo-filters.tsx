'use client';

import { format } from 'date-fns';
import { ChangeEvent, JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui';
import { Todos } from '@/app/projects/medium/todo-list/features';
import { useDebounce } from '@/shared/hooks';
import { FilterSelect } from '@/app/projects/medium/todo-list/components';

/**
 * Интерфейс свойств компонента фильтров задач
 * @typedef {Object} TodoFilter
 * @property {Todos} todos - Массив задач для фильтрации
 * @property {(filteredTodos: Todos) => void} onSetFilteredTodos - Функция обратного вызова для установки отфильтрованных задач
 */
interface TodoFilter {
  todos: Todos;
  onSetFilteredTodos: (filteredTodos: Todos) => void;
}

/**
 * Интерфейс состояния фильтров
 * @typedef {Object} FilterState
 * @property {string} searchTerm - Поисковый запрос
 * @property {string} category - Выбранная категория
 * @property {Date | 'all'} date - Выбранная дата или 'all'
 * @property {string} status - Выбранный статус
 */
interface FilterState {
  searchTerm: string;
  category: string;
  date: Date | 'all';
  status: string;
}

/**
 * Константа с опциями категорий для фильтрации
 * @type {Array<{value: string, label: string}>}
 */
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' },
];

/**
 * Константа с опциями статусов для фильтрации
 * @type {Array<{value: string, label: string}>}
 */
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'incomplete', label: 'Incomplete' },
];

/**
 * Начальное состояние фильтров
 * @type {FilterState}
 */
const INITIAL_FILTER_STATE: FilterState = {
  searchTerm: '',
  category: 'all',
  date: 'all',
  status: 'all',
};

/**
 * Компонент фильтров для списка задач
 * @description Предоставляет интерфейс для фильтрации задач по поисковому запросу, категории, статусу и дате
 * @param {TodoFilter} props - Свойства компонента
 * @returns {JSX.Element} Компонент фильтров
 */
const TodoFilters = ({ todos, onSetFilteredTodos }: TodoFilter): JSX.Element => {
  // Объединенное состояние всех фильтров
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  
  // Дебаунсинг поискового запроса для оптимизации производительности
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  /**
   * Обновляет определенное поле в состоянии фильтров
   * @param {keyof FilterState} field - Ключ поля для обновления
   * @param {any} value - Новое значение
   */
  const updateFilter = useCallback((field: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Обработчик изменения поискового запроса
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения ввода
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateFilter('searchTerm', event.target.value);
  }, [updateFilter]);

  /**
   * Обработчик изменения фильтра по дате
   * @param {string} value - Выбранное значение даты
   */
  const handleDateChange = useCallback((value: string) => {
    updateFilter('date', value === 'all' ? 'all' : new Date(value));
  }, [updateFilter]);

  /**
   * Мемоизированный список уникальных дат из задач
   * @type {Array<string>}
   */
  const dateOptions = useMemo(() => {
    if (!todos?.length) return [];

    // Use a Set for unique dates and convert to array after
    const uniqueDatesSet = new Set<string>();
    todos.forEach(todo => {
      uniqueDatesSet.add(format(new Date(todo.date), 'yyyy-MM-dd'));
    });

    // Convert to array and sort
    return Array.from(uniqueDatesSet).sort((a, b) =>
      new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [todos]);

  /**
   * Мемоизированный список опций дат для селектора
   * @type {Array<{value: string, label: string}>}
   */
  const dateSelectOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All' },
      ...dateOptions.map(dateString => ({
        value: dateString,
        label: format(new Date(dateString), 'PPP')
      }))
    ];
  }, [dateOptions]);

  /**
   * Мемоизированный список отфильтрованных задач
   * @type {Todos}
   */
  const filteredTodos = useMemo(() => {
    if (!todos?.length) return [];

    // Деструктурируем фильтры для удобства
    const { category, status, date } = filters;
    
    // Create lowercase search term once outside the filter loop
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    const isSearching = lowerSearchTerm.length > 0;
    const isFilteringCategory = category !== 'all';
    const isFilteringStatus = status !== 'all';
    const isFilteringDate = date !== 'all';

    // Only filter if at least one filter is active
    if (!isSearching && !isFilteringCategory && !isFilteringStatus && !isFilteringDate) {
      return todos;
    }

    return todos.filter(todo => {
      // Only check search if there's a search term
      const matchesSearch = !isSearching ||
        todo.title.toLowerCase().includes(lowerSearchTerm) ||
        todo.description.toLowerCase().includes(lowerSearchTerm);

      // Only check category if filtering by category
      const matchesCategory = !isFilteringCategory || todo.category === category;

      // Only check status if filtering by status
      const matchesStatus = !isFilteringStatus ||
        (status === 'completed' && todo.completed) ||
        (status === 'incomplete' && !todo.completed);

      // Only check date if filtering by date
      const matchesDate = !isFilteringDate ||
        format(new Date(todo.date), 'yyyy-MM-dd') === format(date as Date, 'yyyy-MM-dd');

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }, [todos, debouncedSearchTerm, filters]);

  /**
   * Эффект для передачи отфильтрованных задач родительскому компоненту
   */
  useEffect(() => {
    onSetFilteredTodos(filteredTodos);
  }, [filteredTodos, onSetFilteredTodos]);

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      <Input
        placeholder="Search todos"
        value={filters.searchTerm}
        onChange={handleSearchChange}
      />
      <FilterSelect
        value={filters.category}
        onValueChange={(value) => updateFilter('category', value)}
        placeholder="All Categories"
        options={CATEGORY_OPTIONS}
      />
      <FilterSelect
        value={filters.status}
        onValueChange={(value) => updateFilter('status', value)}
        placeholder="All"
        options={STATUS_OPTIONS}
      />
      <FilterSelect
        value={filters.date === 'all' ? 'all' : format(filters.date as Date, 'yyyy-MM-dd')}
        onValueChange={handleDateChange}
        placeholder="Date"
        options={dateSelectOptions}
      />
    </div>
  );
};

export default TodoFilters;