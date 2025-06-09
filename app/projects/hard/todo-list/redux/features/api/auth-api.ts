import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/app/projects/hard/todo-list/utils';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
}

// Функция для форматирования ошибок аутентификации
const formatAuthError = (error: unknown): string => {
  if (error instanceof AuthError) {
    // Обработка специфических ошибок Supabase Auth
    if (error.message.includes('Invalid login credentials')) {
      return 'Invalid email or password';
    }
    if (error.message.includes('Email not confirmed')) {
      return 'Please confirm your email before signing in';
    }
    if (error.message.includes('Refresh Token')) {
      return 'Your session has expired. Please sign in again.';
    }
    return error.message;
  }
  
  return String(error) || 'An authentication error occurred';
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation<any, SignInCredentials>({
      queryFn: async ({ email, password }) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          return { data };
        } catch (error) {
          const errorMessage = formatAuthError(error);
          return { error: { status: 'CUSTOM_ERROR', error: errorMessage } };
        }
      },
    }),
    
    signUp: builder.mutation<any, SignUpCredentials>({
      queryFn: async ({ email, password }) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin + '/projects/hard/todo-list'
            }
          });
          
          if (error) throw error;
          return { data };
        } catch (error) {
          const errorMessage = formatAuthError(error);
          return { error: { status: 'CUSTOM_ERROR', error: errorMessage } };
        }
      },
    }),
    
    signOut: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          return { data: null };
        } catch (error) {
          const errorMessage = formatAuthError(error);
          return { error: { status: 'CUSTOM_ERROR', error: errorMessage } };
        }
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
} = authApi; 