import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Post = {
  id: string;
  title: string;
  body: string;
}

export type Posts = Post[];

export type PostsResponse = Post[];

// Типы для конфигурации API
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type EndpointConfig<T = any> = {
  url: string;
  method: HttpMethod;
  body?: T;
}

type ApiEndpoints = {
  create: (body: Partial<Post>) => EndpointConfig<Partial<Post>>;
  read: () => string;
  update: (id: string, body: Partial<Post>) => EndpointConfig<Partial<Post>>;
  delete: (id: string) => EndpointConfig;
}

type ApiConfig = {
  baseUrl: string;
  tagTypes: string;
  endpoints: ApiEndpoints;
}

// Конфигурация API
const API_CONFIG: ApiConfig = {
  baseUrl: 'https://63c83f46e52516043f4ee625.mockapi.io/posts',
  tagTypes: 'Posts',
  endpoints: {
    create: (body) => ({
      url: '',
      method: 'POST',
      body,
    }),
    read: () => '',
    update: (id, body) => ({
      url: `/${id}`,
      method: 'PUT',
      body,
    }),
    delete: (id) => ({
      url: `/${id}`,
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
    read: builder.query<PostsResponse, void>({
      query: () => API_CONFIG.endpoints.read(),
      providesTags: [API_CONFIG.tagTypes],
    }),
    create: builder.mutation<Post, Partial<Post>>({
      query: (newPost) => API_CONFIG.endpoints.create(newPost),
      invalidatesTags: [API_CONFIG.tagTypes],
    }),
    update: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...patch }) => API_CONFIG.endpoints.update(id, patch),
      invalidatesTags: [API_CONFIG.tagTypes],
    }),
    delete: builder.mutation<void, string>({
      query: (id) => API_CONFIG.endpoints.delete(id),
      invalidatesTags: [API_CONFIG.tagTypes],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const { useReadQuery, useCreateMutation, useUpdateMutation, useDeleteMutation } = api;