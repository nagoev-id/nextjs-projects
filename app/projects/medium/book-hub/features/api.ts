import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StaticImageData } from 'next/image';
import bookCover from '../assets/cover.jpg';

/**
 * @typedef {Object} BookItem
 * @description Представляет основную информацию о книге
 * @property {string} id - Уникальный идентификатор книги
 * @property {string[]} author - Массив имен авторов книги
 * @property {string|StaticImageData} cover_id - URL изображения обложки или статическое изображение по умолчанию
 * @property {number} edition_count - Количество изданий книги
 * @property {number} first_publish_year - Год первой публикации
 * @property {string} title - Название книги
 */
export type BookItem = {
  id: string;
  author: string[];
  cover_id: string | StaticImageData;
  edition_count: number;
  first_publish_year: number;
  title: string;
}

/**
 * @typedef {BookItem[]} Books
 * @description Массив объектов книг
 */
export type Books = BookItem[];

/**
 * @typedef {Object} SearchBooksResponse
 * @description Ответ API при поиске книг
 * @property {Object[]} docs - Массив найденных книг
 * @property {string} docs[].key - Ключ книги в формате "/works/ID"
 * @property {string[]} [docs[].author_name] - Массив имен авторов
 * @property {number} [docs[].cover_i] - ID изображения обложки
 * @property {number} [docs[].edition_count] - Количество изданий
 * @property {number} [docs[].first_publish_year] - Год первой публикации
 * @property {string} [docs[].title] - Название книги
 * @property {number} [numFound] - Общее количество найденных книг
 * @property {number} [start] - Индекс начала текущей страницы результатов
 */
export type SearchBooksResponse = {
  docs: {
    key: string;
    author_name?: string[];
    cover_i?: number;
    edition_count?: number;
    first_publish_year?: number;
    title?: string;
  }[];
  numFound?: number;
  start?: number;
  // Adding pagination info that API might return
}

/**
 * @typedef {Object} BookDetails
 * @description Детальная информация о книге
 * @property {string} title - Название книги
 * @property {string|StaticImageData} coverImg - URL изображения обложки или статическое изображение по умолчанию
 * @property {string} description - Описание книги
 * @property {string[]} subject_places - Места, связанные с книгой
 * @property {string[]} subject_times - Временные периоды, связанные с книгой
 * @property {string[]} subjects - Темы книги
 * @property {Array<{key: string, name: string}>} [authors] - Информация об авторах
 * @property {string} [published_date] - Дата публикации
 */
export type BookDetails = {
  title: string;
  coverImg: string | StaticImageData;
  description: string;
  subject_places: string[];
  subject_times: string[];
  subjects: string[];
  // Add optional properties that might be useful
  authors?: Array<{ key: string, name: string }>;
  published_date?: string;
}

/**
 * @typedef {Object} BookDetailsResponse
 * @description Сырой ответ API с детальной информацией о книге
 * @property {string} [title] - Название книги
 * @property {number[]} [covers] - Массив ID изображений обложек
 * @property {string|{value: string}} [description] - Описание книги (может быть строкой или объектом)
 * @property {string[]} [subject_places] - Места, связанные с книгой
 * @property {string[]} [subject_times] - Временные периоды, связанные с книгой
 * @property {string[]} [subjects] - Темы книги
 * @property {Array<{key: string}>} [authors] - Информация об авторах
 */
export type BookDetailsResponse = {
  title?: string;
  covers?: number[];
  description?: string | { value: string };
  subject_places?: string[];
  subject_times?: string[];
  subjects?: string[];
  authors?: Array<{ key: string }>;
}

/**
 * @constant {Object} API_CONFIG
 * @description Конфигурация API для работы с Open Library
 * @property {string} baseUrl - Базовый URL API
 * @property {Object} endpoints - Объект с функциями для формирования эндпоинтов
 * @property {Function} endpoints.readByName - Функция для формирования URL поиска по имени
 * @property {Function} endpoints.readById - Функция для формирования URL получения книги по ID
 * @property {string} coverUrl - Базовый URL для получения изображений обложек
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://openlibrary.org',
  endpoints: {
    readByName: (value: string) => `/search.json?q=${encodeURIComponent(value)}`,
    readById: (id: string) => `/works/${id}.json`,
  },
  coverUrl: 'https://covers.openlibrary.org/b/id',
};

/**
 * @constant {Object} api
 * @description API для взаимодействия с Open Library, созданный с помощью RTK Query
 * @property {string} reducerPath - Путь для хранения состояния API в Redux store
 * @property {Object} baseQuery - Базовый запрос с настройками
 * @property {string[]} tagTypes - Типы тегов для кэширования
 * @property {Object} endpoints - Эндпоинты API
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'max-age=3600');
      return headers;
    },
  }),
  tagTypes: ['Book', 'SearchResults'],
  endpoints: (builder) => ({
    /**
     * @function getByName
     * @description Запрос для поиска книг по названию
     * @param {string} value - Поисковый запрос
     * @returns {Books} Массив найденных книг
     */
    getByName: builder.query<Books, string>({
      query: (value: string) => API_CONFIG.endpoints.readByName(value),
      transformResponse: (response: SearchBooksResponse): Books => {
        if (!response.docs || !Array.isArray(response.docs)) {
          return [];
        }

        return response.docs.slice(0, 20).map((bookSingle): BookItem => ({
          id: bookSingle.key.replace('/works/', ''),
          author: bookSingle.author_name || [],
          cover_id: bookSingle.cover_i
            ? `${API_CONFIG.coverUrl}/${bookSingle.cover_i}-L.jpg`
            : bookCover,
          edition_count: bookSingle.edition_count || 0,
          first_publish_year: bookSingle.first_publish_year || 0,
          title: bookSingle.title || 'Unknown Title',
        }));
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Book' as const, id })),
            { type: 'SearchResults' as const, id: 'LIST' },
          ]
          : [{ type: 'SearchResults' as const, id: 'LIST' }],
    }),
    
    /**
     * @function getById
     * @description Запрос для получения детальной информации о книге по ID
     * @param {string} id - Идентификатор книги
     * @returns {BookDetails} Детальная информация о книге
     */
    getById: builder.query<BookDetails, string>({
      query: (id: string) => API_CONFIG.endpoints.readById(id),
      transformResponse: (response: BookDetailsResponse): BookDetails => {
        const { description, title, covers, subject_places, subject_times, subjects } = response;

        return {
          title: title || 'Unknown Title',
          coverImg: covers && covers.length > 0
            ? `${API_CONFIG.coverUrl}/${covers[0]}-L.jpg`
            : bookCover,
          description: typeof description === 'object' && description?.value
            ? description.value
            : (description as string) || 'No description found',
          subject_places: subject_places || ['No subject places found'],
          subject_times: subject_times || ['No subject times found'],
          subjects: subjects || ['No subjects found'],
        };
      },
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),
  }),
});

/**
 * @description Экспорт хуков для использования в компонентах
 */
export const { useLazyGetByNameQuery, useGetByIdQuery } = api;