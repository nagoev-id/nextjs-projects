import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { CONFIG, supabase } from '@/app/projects/hard/photo-gallery/utils';

const { AUTH } = CONFIG.STATE_MANAGEMENT.FEATURES.API;

// Типизированные интерфейсы для запросов и ответов
interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User | null;
  session: Session | null;
}

interface SignOutResponse {
  success: boolean;
}

interface ProfileUser {
  id: string;
  email: string;
}

interface DeleteUserResponse {
  success: boolean;
  message?: string;
}

/**
 * Форматирует ошибки аутентификации в удобочитаемые сообщения
 * @param error - Объект ошибки от Supabase или другой источник
 * @returns Отформатированное сообщение об ошибке
 */
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

/**
 * Обобщенная функция для обработки запросов аутентификации
 * @param operation - Асинхронная операция аутентификации
 * @returns Результат операции в формате, совместимом с RTK Query
 */
const handleAuthOperation = async <T>(
  operation: () => Promise<any>,
): Promise<QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  try {
    const result = await operation();
    if (result.error) throw result.error;
    
    // Handle signOut case specifically since it doesn't return data in the expected format
    if (result.data === null || result.data === undefined) {
      return { 
        data: { success: true } as unknown as T 
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

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, AuthCredentials>({
      queryFn: ({ email, password }) =>
        handleAuthOperation<AuthResponse>(() =>
          supabase.auth.signInWithPassword({ email, password }),
        ),
    }),

    signUp: builder.mutation<AuthResponse, AuthCredentials>({
      queryFn: ({ email, password }) =>
        handleAuthOperation<AuthResponse>(() =>
          supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/projects/hard/photo-gallery`,
            },
          }),
        ),
    }),

    signOut: builder.mutation<SignOutResponse, void>({
      queryFn: () =>
        handleAuthOperation<SignOutResponse>(() => supabase.auth.signOut()),
    }),

    getUserById: builder.query<ProfileUser, string>({
      queryFn: async (userId) => {
        try {
          // Get current session to access the user's email
          const { data: sessionData } = await supabase.auth.getSession();
          
          // If the requested user is the current user, use the session data
          if (sessionData?.session?.user?.id === userId) {
            return { 
              data: { 
                id: userId, 
                email: sessionData.session.user.email || '' 
              } 
            };
          }
          
          // For other users, try to get from photos table with user join
          const { data: photoData, error: photoError } = await supabase
            .from('photos')
            .select('user:user_id(*)')
            .eq('user_id', userId)
            .limit(1)
            .single();
            
          if (!photoError && photoData?.user && typeof photoData.user === 'object' && 'email' in photoData.user) {
            return {
              data: {
                id: userId,
                email: String(photoData.user.email) || ''
              }
            };
          }
          
          // Otherwise try to get from users table
          const { data, error } = await supabase
            .from('users')
            .select('email, id')
            .eq('id', userId)
            .single();

          if (error) {
            // If we can't get the email, just return the ID
            return { 
              data: { 
                id: userId, 
                email: '' 
              } 
            };
          }
          
          return { 
            data: { 
              id: data.id, 
              email: data.email || '' 
            } 
          };
        } catch (error) {
          console.error('Error fetching user:', error);
          // Even if there's an error, return at least the user ID
          return {
            data: {
              id: userId,
              email: ''
            }
          };
        }
      },
    }),
    
    deleteUser: builder.mutation<DeleteUserResponse, void>({
      queryFn: async () => {
        try {
          // Get current user session
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) throw sessionError;
          
          const userId = sessionData.session?.user?.id;
          if (!userId) {
            throw new Error('No authenticated user found');
          }
          
          console.log(`Deleting user ${userId} and associated data...`);
          
          // 1. Get all photos for this user to delete from storage
          const { data: photos, error: photosError } = await supabase
            .from('photos')
            .select('url, id')
            .eq('user_id', userId);
            
          if (photosError) {
            console.error('Error fetching user photos:', photosError);
            throw photosError;
          }
          
          console.log('Photos to delete:', photos);
          
          // 2. Delete photos from storage bucket
          if (photos && photos.length > 0) {
            console.log(`Found ${photos.length} photos to delete from storage`);
            
            // Check if we have access to the storage bucket
            try {
              const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
              
              if (bucketsError) {
                console.error('Error listing buckets:', bucketsError);
              } else {
                console.log('Available buckets:', buckets);
              }
            } catch (e) {
              console.error('Error checking buckets:', e);
            }
            
            // First approach: Try to delete all files in the user's folder
            try {
              console.log(`Trying to list files in user folder: photos/${userId}`);
              
              const { data: folderList, error: folderError } = await supabase.storage
                .from('photos')
                .list(userId);
                
              if (folderError) {
                console.error('Error listing user folder:', folderError);
              } else if (folderList && folderList.length > 0) {
                console.log(`Found ${folderList.length} files in user folder:`, folderList);
                
                // Delete all files in the user's folder
                const filesToDelete = folderList.map(file => `${userId}/${file.name}`);
                
                if (filesToDelete.length > 0) {
                  console.log('Deleting files:', filesToDelete);
                  const { data: deleteData, error: deleteError } = await supabase.storage
                    .from('photos')
                    .remove(filesToDelete);
                    
                  if (deleteError) {
                    console.error('Error deleting files:', deleteError);
                  } else {
                    console.log(`Successfully deleted files:`, deleteData);
                  }
                }
              } else {
                console.log(`No files found in user folder: ${userId}`);
              }
            } catch (folderError) {
              console.error('Error accessing user folder:', folderError);
            }
            
            // Second approach: Try to delete each file individually based on URL
            for (const photo of photos) {
              try {
                if (!photo.url) {
                  console.log(`Photo ${photo.id} has no URL, skipping`);
                  continue;
                }
                
                console.log(`Processing photo URL: ${photo.url}`);
                
                try {
                  // Extract file path from URL
                  const url = new URL(photo.url);
                  console.log('Parsed URL:', {
                    protocol: url.protocol,
                    hostname: url.hostname,
                    pathname: url.pathname,
                    pathSegments: url.pathname.split('/')
                  });
                  
                  const pathParts = url.pathname.split('/');
                  
                  // Find the storage path
                  // Format is typically: /storage/v1/object/public/bucket-name/file-path
                  const storageIndex = pathParts.indexOf('storage');
                  const publicIndex = pathParts.indexOf('public');
                  const objectIndex = pathParts.indexOf('object');
                  
                  console.log('Path analysis:', {
                    storageIndex,
                    publicIndex,
                    objectIndex,
                    pathParts
                  });
                  
                  if (storageIndex >= 0 && publicIndex >= 0) {
                    const bucketName = pathParts[publicIndex + 1];
                    const filePath = pathParts.slice(publicIndex + 2).join('/');
                    
                    if (bucketName && filePath) {
                      console.log(`Attempting to delete file: ${bucketName}/${filePath}`);
                      
                      // Delete the file from storage
                      const { data: deleteData, error: deleteError } = await supabase.storage
                        .from(bucketName)
                        .remove([filePath]);
                        
                      if (deleteError) {
                        console.error(`Error deleting file ${filePath}:`, deleteError);
                      } else {
                        console.log(`Successfully deleted file: ${filePath}`, deleteData);
                      }
                    } else {
                      console.error(`Invalid bucket or file path: ${bucketName}/${filePath}`);
                    }
                  } else {
                    console.error(`Could not parse storage path from URL: ${photo.url}`);
                    
                    // Try direct approach with userId and filename
                    const filename = url.pathname.split('/').pop();
                    if (filename) {
                      const possiblePath = `${userId}/${filename}`;
                      console.log(`Trying alternative path: ${possiblePath}`);
                      
                      const { data: deleteData, error: deleteError } = await supabase.storage
                        .from('photos')
                        .remove([possiblePath]);
                        
                      if (deleteError) {
                        console.error(`Error deleting file ${possiblePath}:`, deleteError);
                      } else {
                        console.log(`Successfully deleted file: ${possiblePath}`, deleteData);
                      }
                    }
                  }
                } catch (e) {
                  console.error(`Error processing photo URL: ${photo.url}`, e);
                }
              } catch (e) {
                console.error(`Error processing photo: ${photo.id}`, e);
              }
            }
          } else {
            console.log('No photos found to delete');
          }
          
          // 3. Delete all photos from the database
          if (photos && photos.length > 0) {
            console.log('Deleting photos from database...');
            const { error: deletePhotosError } = await supabase
              .from('photos')
              .delete()
              .eq('user_id', userId);
              
            if (deletePhotosError) {
              console.error('Error deleting user photos from database:', deletePhotosError);
              throw deletePhotosError;
            }
            console.log('Successfully deleted photos from database');
          }
          
          // 4. Try to delete user from users table if it exists
          try {
            console.log('Attempting to delete user from users table...');
            const { error: deleteUserError } = await supabase
              .from('users')
              .delete()
              .eq('id', userId);
              
            if (deleteUserError) {
              console.warn('Could not delete user from users table:', deleteUserError);
            } else {
              console.log('Successfully deleted user from users table');
            }
          } catch (e) {
            console.warn('Error attempting to delete user from users table:', e);
          }
          
          // 5. Delete user from auth system
          // Since admin API is not available on client-side, we use the standard API to sign out
          console.log('Signing out user...');
          const { error: signOutError } = await supabase.auth.signOut();
          
          if (signOutError) {
            console.error('Error signing out user:', signOutError);
            throw signOutError;
          }
          
          console.log('User successfully signed out');
          
          return { 
            data: { 
              success: true,
              message: 'User photos deleted and signed out successfully'
            } 
          };
        } catch (error) {
          console.error('Error deleting user:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: errorMessage,
              error: errorMessage,
            },
          };
        }
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
} = authApi;