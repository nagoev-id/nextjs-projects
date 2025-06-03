import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

type TodosResponse = Todo[];

// Конфигурация API
const API_CONFIG = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  endpoints: {
    fetchTodos: () => 'todos',
  },
};

// Создание API с использованием RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    getTodos: builder.query<TodosResponse, string>({
      query: () => API_CONFIG.endpoints.fetchTodos(),
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const { useGetTodosQuery } = api;