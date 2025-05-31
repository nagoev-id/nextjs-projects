import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setItems } from '@/app/projects/medium/mobile-store-cart/features/slice';

export type Mobile = {
  id: string,
  title: string,
  price: string,
  img: string,
  amount: number,
}

export type Mobiles = Mobile[];

// Конфигурация API
const API_CONFIG = {
  baseUrl: 'https://gist.githubusercontent.com/nagoev-alim/07dd3efcc92990ad475513a7e28704d3/raw/e66748f5c17252662bfed9fb91d2f2f1434834a5/mobile-store-cart-app.json',
  endpoints: {
    readAll: () => '',
  },
};

// Создание API с использованием RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    getAll: builder.query<Mobiles, string>({
      query: () => API_CONFIG.endpoints.readAll(),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setItems(data));
        } catch (error) {
          console.error('Error fetching phones:', error);
        }
      },
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const { useGetAllQuery } = api;