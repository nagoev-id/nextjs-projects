import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { shortenerSlice } from '.';


// Конфигурация API
const API_CONFIG = {
  baseUrl: 'https://api.tinyurl.com/create',
  key: 'Wl2gadYaQ1kxXvyrscpipz5ThB6rg5euC0FGoPH1L5IqkLrnxALD7D0N7Hef',
  endpoints: {
    forecast: (query: string) =>
      `forecast.json?key=2260a9d16e4a45e1a44115831212511&q=${query}&days=5&aqi=no&alerts=no`,
  },
};

// Создание API с использованием RTK Query
export const urlShortenerApi = createApi({
  reducerPath: 'urlShortenerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${API_CONFIG.key}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    shortenUrl: builder.mutation({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      transformResponse: (response) => {
        return {
          created_at: response.data.created_at,
          tiny_url: response.data.tiny_url,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(shortenerSlice.actions.addShortenedUrl(data));
        } catch (error) {
          console.error('Error occurred while shortening the URL:', error);
        }
      },
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const { useShortenUrlMutation } = urlShortenerApi;