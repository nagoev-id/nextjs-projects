import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/app/projects/hard/photo-gallery/utils';

export type Photo = {
  id?: string | number;
  user_id?: string;
  url: string;
  created_at?: string;
  description: string;
  is_private?: boolean;
  user?: {
    email?: string;
    id?: string;
  };
};

export type Photos = Photo[];

export type UploadPhotoParams = {
  imageFile: File;
  description: string;
  isPrivate: boolean;
  userId: string;
};

export type DeletePhotoParams = {
  photoId: string | number;
  userId: string;
  url: string;
};

export type DeletePhotoResponse = {
  success: boolean;
  id: string | number;
};

export type GetAllPhotosParams = {
  page: number;
  limit: number;
};

export type PhotosWithPagination = {
  photos: Photos;
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export const photoApi = createApi({
  reducerPath: 'photoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['Photos', 'AllPhotos'],
  endpoints: (builder) => ({
    getPhotos: builder.query<Photos, string>({
      queryFn: async (userId) => {
        try {
          const { data, error } = await supabase
            .from('photos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw new Error(error.message);
          return { data: data || [] };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Photos'],
    }),
    
    getAllPhotos: builder.query<PhotosWithPagination, GetAllPhotosParams | void>({
      queryFn: async (params) => {
        try {
          const page = params?.page ?? 1;
          const limit = params?.limit ?? 20;
          const startIndex = (page - 1) * limit;
          
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1);
            
          if (usersError) console.error('Error fetching users:', usersError);
          
          const { data, error, count } = await supabase
            .from('photos')
            .select('*, user:user_id(*)', { count: 'exact' })
            .or('is_private.is.null,is_private.eq.false')
            .order('created_at', { ascending: false })
            .range(startIndex, startIndex + limit - 1);

          if (error) throw new Error(error.message);
          
          return { 
            data: {
              photos: data || [],
              pagination: {
                totalCount: count || 0,
                currentPage: page,
                totalPages: Math.ceil((count || 0) / limit),
                hasNextPage: (count || 0) > startIndex + limit,
                hasPrevPage: page > 1
              }
            }
          };
        } catch (error) {
          console.error('Error in getAllPhotos:', error);
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ['AllPhotos'],
    }),
    
    uploadPhoto: builder.mutation<Photo, UploadPhotoParams>({
      queryFn: async ({ imageFile, description, isPrivate, userId }) => {
        try {
          const { data: existingUser, error: userCheckError } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();
            
          if (userCheckError || !existingUser) {
            const { data: sessionData } = await supabase.auth.getSession();
            const userEmail = sessionData?.session?.user?.email || '';
            const { error: createUserError } = await supabase
              .from('users')
              .insert([{ id: userId, email: userEmail }]);
              
            if (createUserError) {
              console.error('Error creating user record:', createUserError);
              throw new Error('Failed to create user record: ' + createUserError.message);
            }
            
            console.log('User record created successfully');
          }
          
          const fileExt = imageFile.name.split('.').pop()?.toLowerCase() || '';
          const fileType = imageFile.type;
          
          const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}-${Date.now()}${fileExt ? '.' + fileExt : ''}`;
          const filePath = `${userId}/${fileName}`;
          
          const options = {
            contentType: fileType,
            cacheControl: '3600'
          };
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photos')
            .upload(filePath, imageFile, options);
            
          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(uploadError.message);
          }
          
          const { data: publicUrlData } = supabase.storage
            .from('photos')
            .getPublicUrl(filePath);
            
          const publicUrl = publicUrlData.publicUrl;

          const { data: photoData, error: insertError } = await supabase
            .from('photos')
            .insert([
              {
                user_id: userId,
                url: publicUrl,
                description: description,
                is_private: isPrivate,
              }
            ])
            .select()
            .single();
            
          if (insertError) throw new Error(insertError.message);
          
          return { data: photoData };
        } catch (error) {
          console.error('Error in uploadPhoto:', error);
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Photos', 'AllPhotos'],
    }),
    
    deletePhoto: builder.mutation<DeletePhotoResponse, DeletePhotoParams>({
      queryFn: async ({ photoId, userId, url }) => {
        try {
          const { error: deleteError } = await supabase
            .from('photos')
            .delete()
            .eq('id', photoId)
            .eq('user_id', userId);
            
          if (deleteError) {
            console.error('Error deleting photo from database:', deleteError);
            throw new Error(deleteError.message);
          }
          
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');

            try {
              const publicIndex = pathParts.indexOf('public');
              if (publicIndex >= 0 && publicIndex + 1 < pathParts.length) {
                const bucketName = pathParts[publicIndex + 1];
                const filePath = pathParts.slice(publicIndex + 2).join('/');
                
                if (bucketName && filePath) {
                  const { data, error: storageError } = await supabase.storage
                    .from(bucketName)
                    .remove([filePath]);
                    
                  if (storageError) {
                    console.error('Failed to delete file from storage (method 1):', storageError);
                  } else {
                    console.log('Successfully deleted file from storage (method 1):', data);
                    return { 
                      data: { 
                        success: true,
                        id: photoId
                      } 
                    };
                  }
                }
              }
            } catch (e) {
              console.error('Error in method 1:', e);
            }
            
            try {
              const filename = pathParts[pathParts.length - 1];
              const possiblePath = `${userId}/${filename}`;

              const { data, error: storageError } = await supabase.storage
                .from('photos')
                .remove([possiblePath]);
                
              if (storageError) {
                console.error('Failed to delete file from storage (method 2):', storageError);
              } else {
                console.log('Successfully deleted file from storage (method 2):', data);
              }
            } catch (e) {
              console.error('Error in method 2:', e);
            }
          } catch (storageError) {
            console.error('Failed to process URL or delete file from storage:', storageError);
          }
          
          return { 
            data: { 
              success: true,
              id: photoId
            } 
          };
        } catch (error) {
          console.error('Error in deletePhoto:', error);
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: String(error) 
            } 
          };
        }
      },
      invalidatesTags: ['Photos', 'AllPhotos'],
    }),
  }),
});

export const { 
  useGetPhotosQuery, 
  useGetAllPhotosQuery,
  useUploadPhotoMutation, 
  useDeletePhotoMutation 
} = photoApi;