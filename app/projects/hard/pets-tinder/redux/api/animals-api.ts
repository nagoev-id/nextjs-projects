import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/app/projects/hard/pets-tinder/utils';

export interface Animal {
  id: number;
  user_id: string;
  name: string;
  view: 'd' | 'c';
  breed: string;
  age: number;
  gender: 'm' | 'w';
  price: number;
  color?: string;
  weight?: number;
  height?: number;
  vaccination: boolean;
  pedigree: boolean;
  microchip: boolean;
  description?: string;
  status: 'available' | 'reserved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AnimalCreateRequest {
  user_id: string;
  name: string;
  view: 'd' | 'c';
  breed: string;
  age: number;
  gender: 'm' | 'w';
  price: number;
  color?: string;
  weight?: number;
  height?: number;
  vaccination?: boolean;
  pedigree?: boolean;
  microchip?: boolean;
  description?: string;
  status?: 'available' | 'reserved' | 'closed';
}

export interface AnimalUpdateRequest {
  id: number;
  name?: string;
  view?: 'd' | 'c';
  breed?: string;
  age?: number;
  gender?: 'm' | 'w';
  price?: number;
  color?: string;
  weight?: number;
  height?: number;
  vaccination?: boolean;
  pedigree?: boolean;
  microchip?: boolean;
  description?: string;
  status?: 'available' | 'reserved' | 'closed';
}

export const animalsApi = createApi({
  reducerPath: 'animalsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Animals'],
  endpoints: (builder) => ({
    getAllAnimals: builder.query<Animal[], void>({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from('animals')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: error.message,
                data: error.details,
              },
            };
          }

          return { data: data || [] };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Failed to fetch animals',
              data: null,
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Animals' as const, id })),
              { type: 'Animals', id: 'LIST' },
            ]
          : [{ type: 'Animals', id: 'LIST' }],
    }),
    
    getAnimalsByUserId: builder.query<Animal[], string>({
      async queryFn(userId) {
        try {
          const { data, error } = await supabase
            .from('animals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: error.message,
                data: error.details,
              },
            };
          }

          return { data: data || [] };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Failed to fetch animals',
              data: null,
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Animals' as const, id })),
              { type: 'Animals', id: 'LIST' },
            ]
          : [{ type: 'Animals', id: 'LIST' }],
    }),
    
    getAnimalById: builder.query<Animal, number>({
      async queryFn(id) {
        try {
          const { data, error } = await supabase
            .from('animals')
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
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Failed to fetch animal',
              data: null,
            },
          };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Animals', id }],
    }),
    
    createAnimal: builder.mutation<Animal, AnimalCreateRequest>({
      async queryFn(animalData) {
        try {
          const { data, error } = await supabase
            .from('animals')
            .insert(animalData)
            .select('*')
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
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Failed to create animal',
              data: null,
            },
          };
        }
      },
      invalidatesTags: [{ type: 'Animals', id: 'LIST' }],
    }),
    
    updateAnimal: builder.mutation<Animal, AnimalUpdateRequest>({
      async queryFn({ id, ...updateData }) {
        try {
          const { data, error } = await supabase
            .from('animals')
            .update(updateData)
            .eq('id', id)
            .select('*')
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
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Failed to update animal',
              data: null,
            },
          };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Animals', id },
        { type: 'Animals', id: 'LIST' },
      ],
    }),
    
    deleteAnimal: builder.mutation<{ success: boolean }, number>({
      async queryFn(id) {
        try {
          const { error } = await supabase
            .from('animals')
            .delete()
            .eq('id', id);

          if (error) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: error.message,
                data: error.details,
              },
            };
          }

          return { data: { success: true } };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Failed to delete animal',
              data: null,
            },
          };
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Animals', id },
        { type: 'Animals', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllAnimalsQuery,
  useGetAnimalsByUserIdQuery,
  useGetAnimalByIdQuery,
  useCreateAnimalMutation,
  useUpdateAnimalMutation,
  useDeleteAnimalMutation,
} = animalsApi;