import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * @typedef {Object} QuizQuestion
 * Структура вопроса для квиза
 * @property {string} category - Категория вопроса
 * @property {string} type - Тип вопроса
 * @property {string} difficulty - Сложность вопроса
 * @property {string} question - Текст вопроса
 * @property {string} correct_answer - Правильный ответ
 * @property {string[]} incorrect_answers - Массив неправильных ответов
 */
export type QuizQuestion = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

/**
 * @typedef {Object} QuizParams
 * Параметры для запроса вопросов квиза
 * @property {number} amount - Количество вопросов
 * @property {string} [category] - Категория вопросов (опционально)
 * @property {string} [difficulty] - Сложность вопросов (опционально)
 * @property {string} [type] - Тип вопросов (опционально)
 */
export type QuizParams = {
  amount: number;
  category?: string;
  difficulty?: string;
  type?: string;
}

/**
 * @typedef {Object} QuizResponse
 * Структура ответа от API квиза
 * @property {number} response_code - Код ответа
 * @property {QuizQuestion[]} results - Массив вопросов
 */
export type QuizResponse = {
  response_code: number;
  results: QuizQuestion[];
}

/**
 * @typedef {Object} QuestionsResponse
 * Структура ответа с вопросами и настройками
 * @property {QuizQuestion[]} questions - Массив вопросов
 * @property {QuizParams} settings - Использованные параметры запроса
 */
export type QuestionsResponse = {
  questions: QuizQuestion[];
  settings: QuizParams;
}

/**
 * Конфигурация API для квиза
 * @type {Object}
 */
const API_CONFIG = {
  baseUrl: 'https://opentdb.com/api.php',
  endpoints: {
    /**
     * Конфигурация GET-запроса для получения вопросов
     * @param {QuizParams} params - Параметры запроса
     * @returns {Object} Объект конфигурации запроса
     */
    get: (params: QuizParams) => ({
      url: '/',
      params: {
        ...params,
        encode: 'url3986',
      },
    }),
  },
};

/**
 * Создание API с использованием RTK Query
 * @description Определяет эндпоинты и конфигурацию для взаимодействия с API квиза
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    /**
     * Запрос для получения вопросов квиза
     * @param {QuizParams} params - Параметры запроса
     * @returns {Promise<QuestionsResponse>} Промис с ответом, содержащим вопросы и настройки
     */
    getQuestions: builder.query<QuestionsResponse, QuizParams>({
      query: (params) => API_CONFIG.endpoints.get(params),
      transformResponse: (response: QuizResponse, _, requestParams: QuizParams) => ({
        questions: response.results,
        settings: requestParams,
      }),
    }),
  }),
});

/**
 * Экспорт хуков для использования в компонентах
 */
export const { useLazyGetQuestionsQuery } = api;