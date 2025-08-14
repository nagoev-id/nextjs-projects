'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Check, CircleX, Pencil, Trash2 } from 'lucide-react';
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
  Checkbox,
  Form,
} from '@/components/ui';
import { Todo } from '@/app/projects/medium/todo-list/features';
import { formSchema, FormSchema } from '@/app/projects/medium/todo-list/utils';
import { HELPERS } from '@/shared';
import { toast } from 'sonner';
import { FormInput } from '@/components/layout';

/**
 * Интерфейс свойств компонента элемента задачи
 * @typedef {Object} TodoItemProps
 * @property {Todo} todo - Объект задачи
 * @property {(id: string, completed: boolean) => void} onComplete - Функция для отметки задачи как выполненной
 * @property {(id: string) => void} onDelete - Функция для удаления задачи
 * @property {(todo: Todo) => void} onUpdate - Функция для обновления задачи
 */
interface TodoItem {
  todo: Todo;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (todo: Todo) => void;
}

/**
 * Компонент элемента задачи
 * Отображает отдельную задачу с возможностью редактирования, удаления и отметки о выполнении
 *
 * @param {TodoItemProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент элемента задачи
 */
const TodoItem = React.memo(({ todo, onComplete, onDelete, onUpdate }: TodoItem) => {
  // Состояние для отслеживания редактируемой задачи
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Настройка формы с валидацией через React Hook Form и Zod
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      category: todo.category,
      date: new Date(todo.date),
      color: todo.color,
    },
  });

  /**
   * Обработчик отправки формы редактирования задачи
   * @param {FormSchema} data - Данные формы
   */
  const onSubmit = useCallback(async (data: FormSchema) => {
    try {
      await onUpdate({ ...todo, ...data });
      setIsEditing(false);
      toast.success('Todo updated successfully', { richColors: true });
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast.error('Failed to update todo', { richColors: true });
    }
  }, [todo, onUpdate]);

  /**
   * Обработчик нажатия на кнопку редактирования
   */
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

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
                <div className="ml-auto">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onComplete(todo.id!, todo.completed)}
                    aria-label={`Mark the task "${todo.title}" as ${todo.completed ? 'unfulfilled' : 'executed'}`}
                  />
                </div>
              </div>
              {todo.description && <p>{todo.description}</p>}
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
            {isEditing && (
              <Button
                className="p-2"
                variant="outline"
                type="submit"
                aria-label="Save changes"
              >
                <Check />
              </Button>
            )}

            {/* Кнопка редактирования/отмены редактирования */}
            <Button
              type="button"
              className="p-2"
              variant="outline"
              onClick={isEditing ? () => setIsEditing(false) : handleEditClick}
              aria-label={isEditing ? 'Cancel editing' : 'Edit the task'}
            >
              {isEditing ? <CircleX /> : <Pencil />}
            </Button>

            {/* Диалог подтверждения удаления (отображается только в режиме просмотра) */}
            {!isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="p-2" variant="outline" aria-label="Delete todo">
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
                    <AlertDialogAction onClick={() => onDelete(todo.id!)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;