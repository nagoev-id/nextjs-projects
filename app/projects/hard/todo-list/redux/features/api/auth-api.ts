import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../../utils/supabase';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation<any, SignInCredentials>({
      queryFn: async ({ email, password }) => {
        console.log({ email, password });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw new Error(error.message);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
    
    signUp: builder.mutation<any, SignUpCredentials>({
      queryFn: async ({ email, password }) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw new Error(error.message);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
    
    signOut: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw new Error(error.message);
          return { data: null };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
    
    getSession: builder.query<any, void>({
      queryFn: async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw new Error(error.message);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useGetSessionQuery,
} = authApi; 