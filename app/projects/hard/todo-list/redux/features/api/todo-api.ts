import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/app/projects/hard/todo-list/utils';

export type Todo = {
  id?: string;
  title: string;
  description: string;
  category: string;
  date: Date | string;
  color: string;
  completed: boolean;
  user_id?: string;
  created_at?: string;
};

export type Todos = Todo[];

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todos, string>({
      queryFn: async (userId) => {
        try {
          const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
          if (error) throw new Error(error.message);
          return { data: data || [] };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Todos'],
    }),
    
    createTodo: builder.mutation<Todo, Omit<Todo, 'id' | 'created_at'>>({
      queryFn: async (todo) => {
        try {
          const { data, error } = await supabase
            .from('todos')
            .insert({
              title: todo.title,
              description: todo.description,
              category: todo.category,
              date: new Date(todo.date).toISOString(),
              color: todo.color,
              completed: todo.completed,
              user_id: todo.user_id,
            })
            .select()
            .single();
            
          if (error) throw new Error(error.message);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Todos'],
    }),
    
    updateTodo: builder.mutation<Todo, { id: string; updates: Partial<Todo> }>({
      queryFn: async ({ id, updates }) => {
        try {
          const { data, error } = await supabase
            .from('todos')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
            
          if (error) throw new Error(error.message);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Todos'],
    }),
    
    deleteTodo: builder.mutation<{ success: boolean }, string>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);
            
          if (error) throw new Error(error.message);
          return { data: { success: true } };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi; 