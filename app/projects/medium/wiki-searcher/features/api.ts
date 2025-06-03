import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Интерфейс для результата поиска в Wikipedia.
 * @typedef {Object} WikiSearchResult
 * @property {number} pageid - Уникальный идентификатор страницы.
 * @property {string} title - Заголовок статьи.
 * @property {string} snippet - Краткое описание или отрывок из статьи.
 * @property {number} size - Размер статьи в байтах.
 * @property {number} wordcount - Количество слов в статье.
 * @property {string} timestamp - Временная метка последнего изменения.
 * @property {number} [score] - Оценка релевантности результата (опционально).
 * @property {number} ns - Номер пространства имен статьи.
 */
type WikiSearchResult = {
  pageid: number;
  title: string;
  snippet: string;
  size: number;
  wordcount: number;
  timestamp: string;
  score?: number;
  ns: number;
}

/**
 * API для взаимодействия с Wikipedia.
 * @description Использует RTK Query для создания API-запросов к Wikipedia.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://en.wikipedia.org/w/api.php',
  }),
  endpoints: (builder) => ({
    /**
     * Запрос для поиска статей в Wikipedia.
     * @param {string} searchTerm - Поисковый запрос.
     * @returns {WikiSearchResult[]} Массив результатов поиска.
     */
    searchWiki: builder.query<WikiSearchResult[], string>({
      query: (searchTerm: string) => ({
        url: '',
        params: {
          action: 'query',
          list: 'search',
          srlimit: 20,
          format: 'json',
          origin: '*',
          srsearch: searchTerm,
        },
      }),
      /**
       * Преобразование ответа API.
       * @param {any} response - Ответ от API Wikipedia.
       * @returns {WikiSearchResult[]} Массив результатов поиска.
       */
      transformResponse: (response: any) => response.query.search,
    }),
  }),
});

/**
 * Хук для ленивого выполнения поискового запроса к Wikipedia.
 * @type {function}
 */
export const { useLazySearchWikiQuery } = api;