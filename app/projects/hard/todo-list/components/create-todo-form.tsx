'use client';

/**
 * # Компонент формы создания задачи
 *
 * ## Принцип работы:
 *
 * 1. **Управление формой**:
 *    - Использует react-hook-form для управления состоянием формы
 *    - Применяет Zod для валидации данных формы
 *    - Предоставляет поля для ввода заголовка, описания, категории, даты и цвета задачи
 *
 * 2. **Взаимодействие с API**:
 *    - Использует RTK Query мутацию для отправки данных на сервер
 *    - Обрабатывает состояния загрузки и ошибки
 *    - Отображает уведомления о результате операции
 *
 * 3. **Пользовательский опыт**:
 *    - Предоставляет интуитивно понятный интерфейс для создания задачи
 *    - Включает выбор даты с помощью календаря
 *    - Поддерживает выбор цвета для визуального различения задач
 *    - Блокирует кнопку отправки во время выполнения запроса
 *
 * 4. **Интеграция с Redux**:
 *    - Получает данные о текущем пользователе из Redux-хранилища
 *    - Связывает созданную задачу с идентификатором пользователя
 */

import { JSX, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { FormInput, FormSelect } from '@/components/layout';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { selectAuthSliceData, useAppSelector, useCreateTodoMutation } from '@/app/projects/hard/todo-list/redux';
import { formCreateSchema, FormCreateSchema } from '@/app/projects/hard/todo-list/utils';

/**
 * @typedef {Object} CategoryOption
 * @property {string} value - Значение категории для формы
 * @property {string} label - Отображаемое название категории
 */
type CategoryOption = {
  value: string;
  label: string;
};

/**
 * @interface CreateTodoFormProps
 * @description Интерфейс пропсов компонента формы создания задачи
 * @property {Function} onTodoCreated - Функция обратного вызова, вызываемая после успешного создания задачи
 */
interface CreateTodoFormProps {
  onTodoCreated: () => void;
}

/**
 * Компонент формы создания новой задачи
 *
 * @description Компонент предоставляет форму для создания новой задачи с полями:
 * заголовок, описание, категория, дата и цвет. После успешного создания задачи
 * вызывается функция обратного вызова и отображается уведомление.
 *
 * @param {CreateTodoFormProps} props - Пропсы компонента
 * @param {Function} props.onTodoCreated - Функция обратного вызова после создания задачи
 * @returns {JSX.Element} Компонент формы создания задачи
 *
 * @example
 * // Использование в родительском компоненте
 * <CreateTodoForm onTodoCreated={() => fetchTodos()} />
 */
export const CreateTodoForm = ({ onTodoCreated }: CreateTodoFormProps): JSX.Element => {
  /**
   * Получение данных о текущем пользователе из Redux
   */
  const { user } = useAppSelector(selectAuthSliceData);

  /**
   * RTK Query мутация для создания новой задачи
   * @type {[Function, {isLoading: boolean}]}
   */
  const [createTodo, { isLoading }] = useCreateTodoMutation();

  /**
   * Инициализация формы с использованием react-hook-form и Zod для валидации
   * @type {<FormCreateSchema>}
   */
  const form = useForm<FormCreateSchema>({
    resolver: zodResolver(formCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Personal',
      date: new Date(),
      color: '#222222',
    },
  });

  /**
   * Обработчик отправки формы
   *
   * @description Создает новую задачу на основе данных формы и связывает её с текущим пользователем.
   * Отображает уведомления о результате операции и вызывает функцию обратного вызова при успехе.
   *
   * @param {FormCreateSchema} data - Данные формы, прошедшие валидацию
   * @returns {Promise<void>}
   */
  const onSubmit = useCallback(async (data: FormCreateSchema) => {
    if (!user) {
      toast.error('You must be logged in to create a todo');
      return;
    }

    const { title, description, category, date, color } = data;
    try {
      await createTodo({
        title,
        description,
        category,
        date,
        color,
        completed: false,
        user_id: user.id,
      }).unwrap();

      form.reset();
      toast.success('Todo created successfully', { richColors: true });
      onTodoCreated();
    } catch (error) {
      console.error('Failed to create todo:', error);
      toast.error('Failed to create todo. Please try again.', { richColors: true });
    }
  }, [form, user, onTodoCreated, createTodo]);

  /**
   * Мемоизированный список доступных категорий задач
   * @type {CategoryOption[]}
   */
  const categoryOptions = useMemo((): CategoryOption[] => [
    { value: 'Personal', label: 'Personal' },
    { value: 'Work', label: 'Work' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Other', label: 'Other' },
  ], []);

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          form={form}
          name="title"
          label="Title"
          placeholder="Todo title"
        />
        <FormInput
          form={form}
          type="textarea"
          label="Description"
          name="description"
          placeholder="Todo description"
        />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <FormSelect
            form={form}
            name="category"
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            selectProps={{
              className: 'w-full',
            }}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Pick a date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            form={form}
            name="color"
            type="color"
            label="Pick a color"
            inputProps={{
              className: 'p-0 rounded-sm border-none',
            }}
          />
        </div>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Todo'}</Button>
      </form>
    </Form>
  );
};