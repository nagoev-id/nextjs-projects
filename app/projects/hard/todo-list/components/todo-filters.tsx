'use client';

/**
 * # Компонент фильтрации задач
 *
 * ## Принцип работы:
 *
 * 1. **Фильтрация по категориям**:
 *    - Динамически формирует список категорий на основе имеющихся задач
 *    - Позволяет фильтровать задачи по выбранной категории
 *    - Включает опцию "All Categories" для отображения всех задач
 *
 * 2. **Фильтрация по статусу**:
 *    - Предоставляет возможность фильтрации по статусу выполнения задачи
 *    - Поддерживает три состояния: все задачи, выполненные и активные
 *
 * 3. **Реактивное обновление**:
 *    - Автоматически применяет фильтры при изменении выбранных значений
 *    - Передает отфильтрованный список задач в родительский компонент
 *    - Использует мемоизацию для оптимизации производительности
 */

import { JSX, useEffect, useMemo } from 'react';
import { FormSelect } from '@/components/layout';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui';
import { Todos } from '@/app/projects/hard/todo-list/redux';

/**
 * @interface TodoFiltersProps
 * @description Интерфейс пропсов компонента фильтрации задач
 * @property {Todos} todos - Массив задач для фильтрации
 * @property {Function} onSetFilteredTodos - Функция обратного вызова для передачи отфильтрованных задач
 */
interface TodoFiltersProps {
  todos: Todos;
  onSetFilteredTodos: (filteredTodos: Todos) => void;
}

/**
 * @typedef {Object} FilterFormValues
 * @description Тип для значений формы фильтрации
 * @property {string} category - Выбранная категория фильтрации
 * @property {string} status - Выбранный статус фильтрации
 */
type FilterFormValues = {
  category: string;
  status: string;
};

/**
 * Компонент фильтрации списка задач
 *
 * @description Предоставляет интерфейс для фильтрации задач по категории и статусу выполнения.
 * Автоматически обновляет список отфильтрованных задач при изменении выбранных фильтров.
 *
 * @param {TodoFiltersProps} props - Пропсы компонента
 * @param {Todos} props.todos - Массив задач для фильтрации
 * @param {Function} props.onSetFilteredTodos - Функция обратного вызова для передачи отфильтрованных задач
 * @returns {JSX.Element} Компонент фильтрации задач
 */
export const TodoFilters = ({ todos, onSetFilteredTodos }: TodoFiltersProps): JSX.Element => {
  /**
   * Инициализация формы с использованием react-hook-form
   * @type {FilterFormValues}
   */
  const form = useForm<FilterFormValues>({
    defaultValues: {
      category: 'all',
      status: 'all',
    },
  });

  /**
   * Получение текущих значений фильтров из формы
   */
  const { watch } = form;
  const categoryValue = watch('category');
  const statusValue = watch('status');

  /**
   * Формирование списка опций для фильтра категорий
   * @description Динамически создает список категорий на основе имеющихся задач
   * и добавляет опцию "All Categories" для отображения всех задач
   * @type {Array<{value: string, label: string}>}
   */
  const categoryOptions = useMemo(() => {
    const categories = ['all', ...new Set(todos.map(todo => todo.category))];
    return categories.map(category => ({
      value: category,
      label: category === 'all' ? 'All Categories' : category,
    }));
  }, [todos]);

  /**
   * Список опций для фильтра статуса задач
   * @type {Array<{value: string, label: string}>}
   */
  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'active', label: 'Active' },
  ], []);

  /**
   * Эффект для фильтрации задач при изменении выбранных фильтров
   * @description Применяет выбранные фильтры к списку задач и передает
   * отфильтрованный список через функцию обратного вызова
   */
  useEffect(() => {
    let filtered = [...todos];

    if (categoryValue !== 'all') {
      filtered = filtered.filter(todo => todo.category === categoryValue);
    }

    if (statusValue !== 'all') {
      filtered = filtered.filter(todo => {
        if (statusValue === 'completed') {
          return todo.completed;
        }
        return !todo.completed;
      });
    }

    onSetFilteredTodos(filtered);
  }, [todos, categoryValue, statusValue, onSetFilteredTodos]);

  return (
    <Form {...form}>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormSelect
          form={form}
          name="category"
          label="Filter by Category"
          placeholder="Select category"
          options={categoryOptions}
          selectProps={{
            className: 'w-full',
          }}
        />
        <FormSelect
          form={form}
          name="status"
          label="Filter by Status"
          placeholder="Select status"
          options={statusOptions}
          selectProps={{
            className: 'w-full',
          }}
        />
      </div>
    </Form>
  );
};