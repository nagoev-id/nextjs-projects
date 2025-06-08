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

import { JSX } from 'react';
import { format } from 'date-fns';
import { Button, Card } from '@/components/ui';
import { Check, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Todo } from '@/app/projects/hard/todo-list/services';
import { useDeleteTodoMutation, useUpdateTodoMutation } from '@/app/projects/hard/todo-list/redux';

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
      await deleteTodo(todo.id!).unwrap();
      onUpdate();
      toast.success('Todo deleted successfully', { richColors: true });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo', { richColors: true });
    }
  };

  return (
    <Card className="relative overflow-hidden p-4">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: todo.color }} />
      <div className="grid gap-2 pl-2">
        <div className="flex items-start justify-between gap-2">
          <div className="grid gap-1">
            <h3 className={cn('font-medium text-lg', todo.completed && 'line-through text-muted-foreground')}>
              {todo.title}
            </h3>
            <p className={cn('text-sm text-muted-foreground', todo.completed && 'line-through')}>
              {todo.description}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleComplete}
              disabled={isUpdating}
              className={cn(todo.completed && 'bg-green-50')}
            >
              <Check className={cn('h-4 w-4', todo.completed && 'text-green-500')} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="bg-secondary px-2 py-1 rounded-md">{todo.category}</span>
          <span>{format(new Date(todo.date), 'PPP')}</span>
        </div>
      </div>
    </Card>
  );
};