import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setBreweryList } from '@/app/projects/medium/brewery-finder/features/slice';

/**
 * Интерфейс, описывающий структуру данных пивоварни.
 * @typedef {Object} Brewery
 * @property {string} id - Уникальный идентификатор пивоварни.
 * @property {string} name - Название пивоварни.
 * @property {string} brewery_type - Тип пивоварни.
 * @property {null} address_1 - Первая строка адреса (может быть null).
 * @property {null} address_2 - Вторая строка адреса (может быть null).
 * @property {null} address_3 - Третья строка адреса (может быть null).
 * @property {string} city - Город, в котором находится пивоварня.
 * @property {string} state_province - Штат или провинция.
 * @property {string} postal_code - Почтовый индекс.
 * @property {string} country - Страна.
 * @property {string} longitude - Долгота.
 * @property {string} latitude - Широта.
 * @property {string} phone - Номер телефона.
 * @property {string} website_url - URL веб-сайта.
 * @property {string} state - Штат.
 * @property {null} street - Улица (может быть null).
 */
export type Brewery = {
  id: string,
  name: string,
  brewery_type: string,
  address_1: null,
  address_2: null,
  address_3: null,
  city: string,
  state_province: string,
  postal_code: string,
  country: string,
  longitude: string,
  latitude: string,
  phone: string,
  website_url: string,
  state: string,
  street: null
}

/**
 * Нормализует строку запроса.
 * @param {string} query - Исходная строка запроса.
 * @returns {string} Нормализованная строка запроса (в нижнем регистре и без пробелов по краям).
 */
const normalizeQuery = (query: string): string => query.trim().toLowerCase();

/**
 * Конфигурация API для работы с пивоварнями.
 * @constant
 * @type {Object}
 */
const API_CONFIG = {
  baseUrl: 'https://api.openbrewerydb.org/v1/',
  endpoints: {
    read: () => ({
      url: 'breweries/random',
      params: { size: 50 },
    }),
    readById: (id: string) => `breweries/${id}`,
    searchByValue: (value: string) => ({
      url: 'breweries/search',
      params: { query: normalizeQuery(value) },
    }),
    searchByCountry: (value: string) => ({
      url: 'breweries',
      params: { by_country: normalizeQuery(value) },
    }),
  },
};

/**
 * API для работы с пивоварнями, созданное с использованием RTK Query.
 * @constant
 * @type {Object}
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    get: builder.query<Brewery[], void>({
      query: () => API_CONFIG.endpoints.read(),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setBreweryList(data));
        } catch (error) {
          console.error('Error fetching breweries', error);
        }
      },
    }),
    getById: builder.query<Brewery, string>({
      query: (id) => API_CONFIG.endpoints.readById(id),
    }),
    searchByValue: builder.query<Brewery[], string>({
      query: (value) => API_CONFIG.endpoints.searchByValue(value),
    }),
    searchByCountry: builder.query<Brewery[], string>({
      query: (value) => API_CONFIG.endpoints.searchByCountry(value),
    }),
  }),
});

/**
 * Экспортируемые хуки для использования API в компонентах.
 * @type {Object}
 * @property {Function} useGetQuery - Хук для получения списка случайных пивоварен.
 * @property {Function} useGetByIdQuery - Хук для получения пивоварни по ID.
 * @property {Function} useLazySearchByCountryQuery - Ленивый хук для поиска пивоварен по стране.
 * @property {Function} useLazySearchByValueQuery - Ленивый хук для поиска пивоварен по значению.
 */
export const { useGetQuery, useGetByIdQuery, useLazySearchByCountryQuery, useLazySearchByValueQuery } = api;