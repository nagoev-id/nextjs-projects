'use client';

import { JSX, useEffect, useState } from 'react';
import { Card, Spinner } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { selectAuthSliceData, Todos, useAppSelector, useGetTodosQuery } from '@/app/projects/hard/todo-list/redux';
import { CreateTodoForm, TodoFilters, TodoItem } from '@/app/projects/hard/todo-list/components';

const TodosPage = (): JSX.Element => {
  const { user, isLoading: isAuthLoading } = useAppSelector(selectAuthSliceData);
  const router = useRouter();
  const [filteredTodos, setFilteredTodos] = useState<Todos>([]);

  const {
    data: todos = [],
    isLoading,
    isError,
    refetch,
  } = useGetTodosQuery(user?.id || '', {
    skip: !user,
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/projects/hard/todo-list');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="grid place-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Card className="grid gap-4 p-4">
      <CreateTodoForm onTodoCreated={refetch} />

      {isLoading && <Spinner />}

      {isError && (
        <p className="text-center text-red-500">Failed to load todos. Please try again later.</p>
      )}

      {!isLoading && !isError && todos.length === 0 && (
        <p className="text-center">You haven&#39;t created any todos yet.</p>
      )}

      {!isLoading && !isError && todos.length > 0 && (
        <div className="grid gap-3">
          <TodoFilters todos={todos} onSetFilteredTodos={setFilteredTodos} />

          <ul className="grid gap-3" aria-label="Todo list">
            {filteredTodos.map(todo => (
              <li key={todo.id}>
                <TodoItem todo={todo} onUpdate={refetch} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default TodosPage;