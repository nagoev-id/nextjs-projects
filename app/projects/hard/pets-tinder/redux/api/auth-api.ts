import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react';
import { AuthError } from '@supabase/supabase-js';
import {
  AuthApiCredentials,
  AuthApiResponse,
  AuthApiSignOutResponse,
  CONFIG,
  supabase,
} from '@/app/projects/hard/pets-tinder/utils';

const { AUTH } = CONFIG.STATE_MANAGEMENT.FEATURES.API;

const formatAuthError = (error: unknown): string => {
  if (error instanceof AuthError) {
    const message = error.message;

    if (message.includes(AUTH.ERROR_MESSAGES.INVALID_CREDENTIALS_IN)) {
      return AUTH.ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    if (message.includes(AUTH.ERROR_MESSAGES.EMAIL_NOT_CONFIRMED_IN)) {
      return AUTH.ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
    }
    if (message.includes(AUTH.ERROR_MESSAGES.SESSION_EXPIRED_IN)) {
      return AUTH.ERROR_MESSAGES.SESSION_EXPIRED;
    }
    return message;
  }

  return String(error) || AUTH.ERROR_MESSAGES.DEFAULT;
};

const handleAuthOperation = async <T>(
  operation: () => Promise<any>,
): Promise<QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  try {
    const result = await operation();
    if (result.error) throw result.error;

    if (result.data === null || result.data === undefined) {
      return {
        data: { success: true } as unknown as T,
      };
    }

    return { data: result.data as T };
  } catch (error) {
    const errorMessage = formatAuthError(error);
    return {
      error: {
        status: 'CUSTOM_ERROR',
        data: errorMessage,
        error: errorMessage,
      },
    };
  }
};

// Define the interface for reset password request
interface ResetPasswordRequest {
  email: string;
}

interface UpdatePasswordCredentials {
  password: string;
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthApiResponse, AuthApiCredentials>({
      queryFn: ({ email, password }) =>
        handleAuthOperation<AuthApiResponse>(() =>
          supabase.auth.signInWithPassword({ email, password }),
        ),
    }),

    signUp: builder.mutation<AuthApiResponse, AuthApiCredentials>({
      queryFn: ({ email, password }) =>
        handleAuthOperation<AuthApiResponse>(() =>
          supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/projects/hard/pets-tinder`,
            },
          }),
        ),
    }),

    signOut: builder.mutation<AuthApiSignOutResponse, void>({
      queryFn: () =>
        handleAuthOperation<AuthApiSignOutResponse>(() => supabase.auth.signOut()),
    }),

    resetPassword: builder.mutation<{ success: boolean }, ResetPasswordRequest>({
      queryFn: ({ email }) =>
        handleAuthOperation<{ success: boolean }>(() =>
          supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/projects/hard/pets-tinder/update-password`,
          }),
        ),
    }),

    updatePassword: builder.mutation<any, UpdatePasswordCredentials>({
      queryFn: async ({ password }) => {
        try {
          const { data, error } = await supabase.auth.updateUser({
            password,
          });

          if (error) throw error;

          await supabase.auth.signOut();

          return { data };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
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
  useResetPasswordMutation,
  useUpdatePasswordMutation
} = authApi;