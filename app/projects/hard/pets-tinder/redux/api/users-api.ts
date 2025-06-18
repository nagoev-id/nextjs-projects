import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/app/projects/hard/pets-tinder/utils';

export interface UpdateUserRequest {
  id: string;
  username?: string;
  phone?: string;
  full_name?: string;
  is_active?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  full_name: string;
  registration_date: string;
  last_login: string;
  is_active: boolean;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      async queryFn(id) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
              data: error.details,
            },
          };
        }
        return { data };
      },
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      async queryFn({ id, ...fields }) {
        const { data, error } = await supabase
          .from('users')
          .update(fields)
          .eq('id', id)
          .select()
          .single();
        if (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
              data: error.details,
            },
          };
        }
        return { data };
      },
    }),
  }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation } = usersApi;
