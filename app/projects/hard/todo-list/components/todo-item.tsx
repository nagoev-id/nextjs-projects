'use client';

/**
 * # Компонент элемента задачи
 *
 * ## Принцип работы:
 *
 * 1. **Отображение задачи**:
 *    - Визуализирует отдельную задачу с заголовком, описанием, категорией и датой
 *    - Использует цветовую метку для визуального различения задач
 *    - Применяет зачеркивание текста для выполненных задач
 *
 * 2. **Управление задачей**:
 *    - Предоставляет кнопки для изменения статуса выполнения задачи
 *    - Позволяет удалять задачу из списка
 *    - Отображает состояние загрузки во время выполнения операций
 *
 * 3. **Взаимодействие с API**:
 *    - Использует RTK Query мутации для обновления и удаления задач
 *    - Обрабатывает успешные и ошибочные результаты операций
 *    - Отображает уведомления о результатах действий
 *
 * 4. **Обратная связь с родительским компонентом**:
 *    - Вызывает функцию обратного вызова после успешных операций
 *    - Обеспечивает обновление списка задач в родительском компоненте
 */

import React, { JSX, useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
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
  Badge,
  Button,
  Card,
  Form,
} from '@/components/ui';
import { Check, CircleX, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Todo, useDeleteTodoMutation, useUpdateTodoMutation } from '@/app/projects/hard/todo-list/redux';
import { FormInput } from '@/components/layout';
import { HELPERS } from '@/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormCreateSchema, formCreateSchema } from '@/app/projects/hard/todo-list/utils';
import { cn } from '@/lib/utils';

/**
 * @interface TodoItemProps
 * @description Интерфейс пропсов компонента элемента задачи
 * @property {Todo} todo - Объект задачи для отображения
 * @property {Function} onUpdate - Функция обратного вызова, вызываемая после успешного обновления или удаления задачи
 */
interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

/**
 * Компонент для отображения отдельной задачи
 *
 * @description Отображает карточку задачи с заголовком, описанием, категорией и датой.
 * Предоставляет возможность отметить задачу как выполненную или удалить её.
 * Использует RTK Query для взаимодействия с API.
 *
 * @param {TodoItemProps} props - Пропсы компонента
 * @param {Todo} props.todo - Объект задачи для отображения
 * @param {Function} props.onUpdate - Функция обратного вызова после обновления/удаления
 * @returns {JSX.Element} Компонент элемента задачи
 */
export const TodoItem = ({ todo, onUpdate }: TodoItemProps): JSX.Element => {
  /**
   * RTK Query мутация для обновления задачи
   * @type {[Function, {isLoading: boolean}]}
   */
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();

  /**
   * RTK Query мутация для удаления задачи
   * @type {[Function, {isLoading: boolean}]}
   */
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Настройка формы с валидацией через React Hook Form и Zod
  const form = useForm<FormCreateSchema>({
    resolver: zodResolver(formCreateSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      category: todo.category,
      date: new Date(todo.date),
      color: todo.color,
    },
  });

  /**
   * Обработчик переключения статуса выполнения задачи
   *
   * @description Отправляет запрос на обновление статуса задачи и отображает уведомление о результате
   * @returns {Promise<void>}
   */
  const handleToggleComplete = async () => {
    try {
      await updateTodo({
        id: todo.id!,
        updates: { completed: !todo.completed },
      }).unwrap();
      onUpdate();
      toast.success('Todo status updated successfully', { richColors: true });
    } catch (error) {
      console.error('Failed to update todo status:', error);
      toast.error('Failed to update todo status', { richColors: true });
    }
  };

  /**
   * Обработчик удаления задачи
   *
   * @description Отправляет запрос на удаление задачи и отображает уведомление о результате
   * @returns {Promise<void>}
   */
  const handleDelete = async () => {
    try {
      const result = await deleteTodo(todo.id!).unwrap();
      if (result.success) {
        onUpdate();
        toast.success('Todo deleted successfully', { richColors: true });
      } else {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo', { richColors: true });
    }
  };


  /**
   * Обработчик отправки формы редактирования задачи
   * @param {FormCreateSchema} data - Данные формы
   */
  const onSubmit = useCallback(async (data: FormCreateSchema) => {
    try {
      // Проверяем, что у нас есть все необходимые данные
      if (!data.title || !data.description) {
        toast.error('Title and description are required');
        return;
      }
      
      // Отправляем запрос на обновление задачи
      await updateTodo({
        id: todo.id!,
        updates: {
          title: data.title,
          description: data.description,
          // Сохраняем остальные поля без изменений, если они не были изменены
          category: data.category || todo.category,
          date: data.date ? new Date(data.date).toISOString() : todo.date,
          color: data.color || todo.color
        },
      }).unwrap();

      // Закрываем режим редактирования и обновляем список задач
      setIsEditing(false);
      onUpdate();
      toast.success('Todo updated successfully', { richColors: true });
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast.error('Failed to update todo', { richColors: true });
    }
  }, [todo.id, todo.category, todo.date, todo.color, updateTodo, onUpdate]);

  /**
   * Обработчик нажатия на кнопку редактирования
   */
  const handleEditClick = useCallback(() => {
    // Сбрасываем форму к текущим значениям задачи
    form.reset({
      title: todo.title,
      description: todo.description,
      category: todo.category,
      date: new Date(todo.date),
      color: todo.color,
    });
    setIsEditing(true);
  }, [form, todo]);
  
  /**
   * Обработчик отмены редактирования
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    // Сбрасываем форму к текущим значениям задачи
    form.reset({
      title: todo.title,
      description: todo.description,
      category: todo.category,
      date: new Date(todo.date),
      color: todo.color,
    });
  }, [form, todo]);

  /**
   * Мемоизированные стили для карточки задачи
   */
  const cardStyle = useMemo(() => {
    const defaultColor = '#fcd34d';
    const color = todo.color || defaultColor;
    return {
      borderLeftColor: color,
      backgroundColor: HELPERS.convertHexToRgb(color, 0.02),
    };
  }, [todo.color]);

  /**
   * Мемоизированная дата в отформатированном виде
   */
  const formattedDate = useMemo(() => format(new Date(todo.date), 'PPP'), [todo.date]);

  return (
    <Card className="grid gap-3 p-4 border-l-6 rounded-sm overflow-hidden" style={cardStyle}>
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Режим редактирования: отображаем поля ввода */}
          {isEditing ? (
            <>
              <FormInput form={form} name="title" placeholder="Todo title" />
              <FormInput form={form} name="description" placeholder="Todo description" />
            </>
          ) : (
            /* Режим просмотра: отображаем заголовок и описание задачи */
            <>
              <div className="inline-flex w-full gap-2">
                <h3
                  className={`font-semibold text-lg ${todo.completed ? 'line-through' : ''}`}
                  aria-checked={todo.completed}
                >
                  {todo.title}
                </h3>
              </div>
              {todo.description && <p className={todo.completed ? 'line-through' : ''}>{todo.description}</p>}
            </>
          )}

          {/* Отображение категории и даты задачи */}
          <div className="inline-flex flex-wrap gap-2 justify-between w-full">
            <Badge>{todo.category}</Badge>
            <p>{formattedDate}</p>
          </div>

          {/* Кнопки управления задачей */}
          <div className="flex justify-end gap-2">
            {/* Кнопка сохранения изменений (отображается только в режиме редактирования) */}
            {isEditing ? (
              <Button
                className="p-2"
                variant="outline"
                type="submit"
                disabled={isUpdating}
                aria-label="Save changes"
              >
                <Check />
              </Button>
            ):(
              <Button
                type="button"
                variant="outline"
                onClick={handleToggleComplete}
                disabled={isUpdating}
                className={cn(todo.completed && 'bg-green-50')}
              >
                <Check className={cn('h-4 w-4', todo.completed && 'text-green-500')} />
              </Button>
            )}

            {/* Кнопка редактирования/отмены редактирования */}
            <Button
              type="button"
              className="p-2"
              variant="outline"
              onClick={isEditing ? handleCancelEdit : handleEditClick}
              aria-label={isEditing ? 'Cancel editing' : 'Edit the task'}
            >
              {isEditing ? <CircleX /> : <Pencil />}
            </Button>

            {/* Диалог подтверждения удаления (отображается только в режиме просмотра) */}
            {!isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="p-2" variant="outline" aria-label="Delete todo" disabled={isDeleting}>
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
};