import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setItems } from '@/app/projects/medium/shopping-market-cart/features';

// Улучшенная типизация с использованием базового интерфейса
export interface BaseProduct {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number, count: number };
  title: string;
}

// Расширение базового интерфейса для продукта
export interface Product extends BaseProduct {
  amount: number;
}

export type Products = Product[];

// CartItem теперь не дублирует свойства Product
export type CartItem = Product;
export type CartItems = CartItem[];

// Расширенная конфигурация API
const API_CONFIG = {
  baseUrl: 'https://fakestoreapi.com',
  tag: 'Products',
  endpoints: {
    readAll: () => '/products',
  },
};

// Создание API с использованием RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  tagTypes: [API_CONFIG.tag],
  endpoints: (builder) => ({
    getProducts: builder.query<Products, void>({
      query: () => API_CONFIG.endpoints.readAll(),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setItems(data));
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
      providesTags: ['Products'],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const { useGetProductsQuery } = api;