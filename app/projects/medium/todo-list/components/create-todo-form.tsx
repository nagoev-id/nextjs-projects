'use client';

import { JSX, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormSchema, formSchema } from '@/app/projects/medium/todo-list/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMutation } from '@/app/projects/medium/todo-list/features';
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

/**
 * @typedef {Object} CategoryOption
 * @property {string} value - Значение категории
 * @property {string} label - Отображаемое название категории
 */

type CategoryOption = {
  value: string;
  label: string;
};

/**
 * Компонент формы создания новой задачи
 * @description Форма для добавления новой задачи с полями: заголовок, описание, категория, дата и цвет
 * @returns {JSX.Element} Компонент формы создания задачи
 */
const CreateTodoForm = (): JSX.Element => {
  /**
   * Хук для создания новой задачи с использованием RTK Query
   * @type {[Function, {isLoading: boolean}]} - Функция создания и состояние загрузки
   */
  const [createTodo, { isLoading }] = useCreateMutation();

  /**
   * Инициализация формы с использованием react-hook-form и zod для валидации
   * @type {FormSchema}
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Personal',
      date: new Date(),
      color: '#222222',
    },
  });

  const onSubmit = useCallback(async (data: FormSchema) => {
    const { title, description, category, date, color } = data;
    try {
      await createTodo({ title, description, category, date, color, completed: false }).unwrap();
      form.reset();
      toast.success('Todo created successfully', { richColors: true });
    } catch (error) {
      console.error('Failed to create todo:', error);
      toast.error('Failed to create todo. Please try again.', { richColors: true });
    }
  }, [createTodo, form]);

  /**
   * Список доступных категорий для задач
   * @type {Array<CategoryOption>}
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

export default CreateTodoForm;