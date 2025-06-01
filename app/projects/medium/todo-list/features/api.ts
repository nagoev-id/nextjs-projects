import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Todo = {
  id?: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  color: string;
  completed: boolean;
}

export type Todos = Todo[];

// Конфигурация API
const API_CONFIG = {
  baseUrl: 'http://localhost:4000',
  tagTypes: 'Todos' as const,
  endpoints: {
    create: (body: Todo) => ({
      url: 'todos',
      method: 'POST',
      body,
    }),
    read: () => 'todos',
    update: (id: string, body: Partial<Todo>) => ({
      url: `todos/${id}`,
      method: 'PATCH',
      body,
    }),
    delete: (id: string) => ({
      url: `todos/${id}`,
      method: 'DELETE',
    }),
  },
};

// Создание API с использованием RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  tagTypes: [API_CONFIG.tagTypes],
  endpoints: (builder) => ({
    create: builder.mutation<Todo, Omit<Todo, 'id'>>({
      query: (todo) => API_CONFIG.endpoints.create(todo),
      invalidatesTags: [API_CONFIG.tagTypes],
    }),
    get: builder.query<Todo[], void>({
      query: () => API_CONFIG.endpoints.read(),
      providesTags: [API_CONFIG.tagTypes],
    }),
    update: builder.mutation<Todo, Partial<Todo> & Pick<Todo, 'id'>>({
      query: ({ id, ...patch }) => API_CONFIG.endpoints.update(id!, patch),
      invalidatesTags: [API_CONFIG.tagTypes],
    }),
    delete: builder.mutation<void, string>({
      query: (id) => API_CONFIG.endpoints.delete(id),
      invalidatesTags: [API_CONFIG.tagTypes],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const {
  useCreateMutation,
  useGetQuery,
  useDeleteMutation,
  useUpdateMutation,
} = api;