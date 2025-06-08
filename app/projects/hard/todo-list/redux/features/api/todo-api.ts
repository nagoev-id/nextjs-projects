import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../../utils/supabase';
import { RootState } from '../../store';

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
    baseUrl: 'https://pzgxijkvkfnswedrwlza.supabase.co/rest/v1',
    prepareHeaders: (headers) => {
      headers.set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Z3hpamt2a2Zuc3dlZHJ3bHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDg4MTAsImV4cCI6MjA2NDg4NDgxMH0.I7AkC80ar725Uzkf1q4pQrq1GJoJwcW_pzklp_iVb3w');
      headers.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Z3hpamt2a2Zuc3dlZHJ3bHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDg4MTAsImV4cCI6MjA2NDg4NDgxMH0.I7AkC80ar725Uzkf1q4pQrq1GJoJwcW_pzklp_iVb3w`);
      headers.set('Content-Type', 'application/json');
      
      // Get session token from state if available
      const state = store.getState() as RootState;
      if (state.auth.session?.access_token) {
        headers.set('Authorization', `Bearer ${state.auth.session.access_token}`);
      }
      
      return headers;
    },
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
    
    deleteTodo: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);
            
          if (error) throw new Error(error.message);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Todos'],
    }),
  }),
});

// Inject store reference later to avoid circular dependency
let store: any;
export const injectStore = (_store: any) => {
  store = _store;
};

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi; 