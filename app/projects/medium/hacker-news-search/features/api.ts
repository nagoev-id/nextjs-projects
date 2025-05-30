import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * @typedef {Object} Hint
 * @description Тип данных для отдельной новости из Hacker News
 * @property {string} objectID - Уникальный идентификатор новости
 * @property {string} title - Заголовок новости
 * @property {number} points - Количество очков (рейтинг) новости
 * @property {string} author - Имя автора новости
 * @property {number} num_comments - Количество комментариев к новости
 * @property {string} url - URL-адрес источника новости
 */
export type Hint = {
  objectID: string,
  title: string,
  points: number,
  author: string,
  num_comments: number,
  url: string
}

/**
 * @typedef {Hint[]} Hints
 * @description Массив новостей из Hacker News
 */
export type Hints = Hint[];

/**
 * @typedef {Object} NewsQueryParams
 * @description Параметры запроса для поиска новостей
 * @property {string} query - Поисковый запрос
 * @property {number} page - Номер страницы результатов (начиная с 0)
 */
type NewsQueryParams = {
  query: string;
  page: number;
}

/**
 * @typedef {Object} NewsResponse
 * @description Формат ответа API с результатами поиска новостей
 * @property {Hints} hits - Массив найденных новостей
 * @property {number} nbPages - Общее количество страниц результатов
 */
type NewsResponse = {
  hits: Hints;
  nbPages: number;
}

/**
 * @constant {Object} API_CONFIG
 * @description Конфигурация API для работы с Hacker News
 * @property {string} baseUrl - Базовый URL API Hacker News
 * @property {Object} endpoints - Объект с методами для формирования эндпоинтов
 * @property {Function} endpoints.read - Метод для формирования эндпоинта поиска новостей
 */
const API_CONFIG = {
  baseUrl: 'https://hn.algolia.com/api/v1',
  endpoints: {
    /**
     * @function read
     * @description Формирует параметры запроса для поиска новостей
     * @param {string} query - Поисковый запрос
     * @param {number} page - Номер страницы результатов
     * @returns {Object} Объект с URL и параметрами запроса
     */
    read: (query: string, page: number) => ({
      url: 'search',
      params: { query, page },
    }),
  },
};

/**
 * @constant {Object} api
 * @description API для работы с Hacker News, созданное с использованием RTK Query
 * @property {string} reducerPath - Путь для хранения состояния API в Redux-хранилище
 * @property {Object} baseQuery - Базовый запрос с настройками
 * @property {Object} endpoints - Эндпоинты API
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    /**
     * @function get
     * @description Запрос для получения новостей по поисковому запросу и номеру страницы
     * @param {NewsQueryParams} params - Параметры запроса (query и page)
     * @returns {Promise<NewsResponse>} Промис с результатами поиска
     */
    get: builder.query<NewsResponse, NewsQueryParams>({
      query: ({ query, page }) => API_CONFIG.endpoints.read(query, page),
      /**
       * @function transformResponse
       * @description Преобразует ответ API в нужный формат
       * @param {NewsResponse} response - Исходный ответ API
       * @returns {NewsResponse} Преобразованный ответ с hits и nbPages
       */
      transformResponse: (response: NewsResponse) => ({
        hits: response.hits,
        nbPages: response.nbPages,
      }),
    }),
  }),
});

/**
 * @constant {Object} useGetQuery
 * @description Хук для выполнения запроса на получение новостей
 * @constant {Object} useLazyGetQuery
 * @description Ленивый хук для выполнения запроса на получение новостей по требованию
 */
export const { useGetQuery, useLazyGetQuery } = api;