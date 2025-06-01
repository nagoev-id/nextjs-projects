'use client';

/**
 * # Приложение Todo List
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и загрузка данных**:
 *    - При монтировании компонента выполняется запрос к API для получения списка задач
 *    - Используется RTK Query для управления состоянием запроса (загрузка, успех, ошибка)
 *    - Состояние отфильтрованных задач хранится локально с помощью useState
 *
 * 2. **Создание задач**:
 *    - Пользователь может создавать новые задачи через компонент CreateTodoForm
 *    - Форма включает поля для заголовка, описания, категории, даты и цвета задачи
 *    - Валидация формы осуществляется с помощью React Hook Form и Zod
 *
 * 3. **Отображение задач**:
 *    - Задачи отображаются в виде карточек с цветовой маркировкой слева
 *    - Каждая карточка содержит заголовок, описание, категорию и дату задачи
 *    - Выполненные задачи отмечаются зачеркнутым текстом
 *
 * 4. **Фильтрация задач**:
 *    - Пользователь может фильтровать задачи по категории и статусу выполнения
 *    - Компонент TodoFilters управляет фильтрацией и обновляет список отображаемых задач
 *
 * 5. **Управление задачами**:
 *    - Каждую задачу можно отметить как выполненную/невыполненную
 *    - Задачи можно редактировать, изменяя любые их параметры
 *    - Задачи можно удалять с подтверждением действия
 *
 * 6. **Обработка ошибок**:
 *    - Все операции с задачами (создание, обновление, удаление) обрабатываются с уведомлениями
 *    - При ошибках загрузки или операций с задачами отображаются соответствующие сообщения
 *    - Используется библиотека toast для отображения уведомлений
 *
 * 7. **Оптимизация производительности**:
 *    - Используются мемоизированные колбэки (useCallback) для предотвращения лишних рендеров
 *    - Компонент TodoItem обернут в React.memo для оптимизации перерисовок
 *
 * Приложение предоставляет полный набор функций CRUD для управления задачами с интуитивно
 * понятным пользовательским интерфейсом и обратной связью для всех действий пользователя.
 */

import { JSX, useCallback, useState } from 'react';
import { Card, Spinner } from '@/components/ui';
import { Todos, useDeleteMutation, useGetQuery, useUpdateMutation } from '@/app/projects/medium/todo-list/features';
import { CreateTodoForm, TodoFilters, TodoItem } from '@/app/projects/medium/todo-list/components';
import { toast } from 'sonner';

/**
 * Компонент страницы списка задач
 * 
 * Основной компонент приложения, который управляет отображением и взаимодействием со списком задач.
 * Включает в себя форму создания задач, фильтры и список задач с возможностью управления ими.
 * 
 * @returns {JSX.Element} Компонент страницы списка задач
 */
const TodoListPage = (): JSX.Element => {
  /**
   * Получение списка задач с использованием RTK Query
   * @type {Object} Результат запроса, включающий данные и состояние запроса
   * @property {Todos} data - Список задач, по умолчанию пустой массив
   * @property {boolean} isError - Флаг ошибки запроса
   * @property {boolean} isSuccess - Флаг успешного запроса
   * @property {boolean} isLoading - Флаг загрузки данных
   */
  const { data: todos = [], isError, isSuccess, isLoading } = useGetQuery();
  
  /**
   * Состояние для хранения отфильтрованных задач
   * @type {[Todos, React.Dispatch<React.SetStateAction<Todos>>]}
   */
  const [filteredTodos, setFilteredTodos] = useState<Todos>([]);
  
  /**
   * Хук мутации для обновления задачи
   * @type {[Function, Object]} Функция обновления и состояние мутации
   */
  const [updateTodo] = useUpdateMutation();
  
  /**
   * Хук мутации для удаления задачи
   * @type {[Function, Object]} Функция удаления и состояние мутации
   */
  const [deleteTodo] = useDeleteMutation();

  /**
   * Обработчик изменения статуса выполнения задачи
   * 
   * @param {string} id - Идентификатор задачи
   * @param {boolean} completed - Текущий статус выполнения задачи
   * @returns {Promise<void>} Promise, который разрешается после обновления статуса
   */
  const handleCompletedTodo = useCallback(async (id: string, completed: boolean) => {
    try {
      // Инвертируем текущий статус выполнения
      await updateTodo({ id, completed: !completed }).unwrap();
      toast.success('Todo status updated successfully', { richColors: true });
    } catch (error) {
      console.error('Failed to update todo status:', error);
      toast.error('Failed to update todo status', { richColors: true });
    }
  }, [updateTodo]);

  /**
   * Обработчик удаления задачи
   * 
   * @param {string} id - Идентификатор задачи для удаления
   * @returns {Promise<void>} Promise, который разрешается после удаления задачи
   */
  const handleDeleteTodo = useCallback(async (id: string) => {
    try {
      await deleteTodo(id).unwrap();
      toast.success('Todo deleted successfully', { richColors: true });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo', { richColors: true });
    }
  }, [deleteTodo]);

  return (
    <Card className="grid gap-4 p-2">
      {/* Форма создания новой задачи */}
      <CreateTodoForm />
      
      {/* Индикатор загрузки */}
      {isLoading && <Spinner />}
      
      {/* Сообщение об ошибке */}
      {isError && (<p className="text-center text-red-500">Failed to load todos. Please try again later.</p>)}
      
      {/* Сообщение о пустом списке задач */}
      {isSuccess && todos.length === 0 && (
        <p className="text-center">You haven&#39;t created any todos yet.</p>
      )}
      
      {/* Отображение списка задач */}
      {isSuccess && todos.length > 0 && (
        <div className="grid gap-3">
          {/* Компонент фильтрации задач */}
          <TodoFilters todos={todos} onSetFilteredTodos={setFilteredTodos} />
          
          {/* Список отфильтрованных задач */}
          <ul className="grid gap-3" aria-label="Todo list">
            {filteredTodos.map(todo => (
              <li key={todo.id}>
                <TodoItem
                  todo={todo}
                  onComplete={handleCompletedTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={updateTodo}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default TodoListPage;