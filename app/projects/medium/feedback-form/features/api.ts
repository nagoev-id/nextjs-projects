import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Константы для API
 */
const API_BASE_URL = 'https://63c83f46e52516043f4ee625.mockapi.io/reviews';
const TAG_REVIEW = 'Review';

/**
 * Типы и интерфейсы
 */
/**
 * @typedef {Object} Feedback - Тип для отзыва
 * @property {string} id - Уникальный идентификатор отзыва
 * @property {string} rating - Рейтинг отзыва
 * @property {string} review - Текст отзыва
 */
export type Feedback = {
  id: string,
  rating: string,
  review: string,
}

/** @typedef {Omit<Feedback, 'id'>} CreateFeedbackDto - DTO для создания отзыва */
export type CreateFeedbackDto = Omit<Feedback, 'id'>;

/** @typedef {Partial<CreateFeedbackDto>} UpdateFeedbackDto - DTO для обновления отзыва */
export type UpdateFeedbackDto = Partial<CreateFeedbackDto>;

/** 
 * @typedef {Object} UpdateReviewRequest - Запрос на обновление отзыва
 * @property {string} reviewId - ID обновляемого отзыва
 * @property {UpdateFeedbackDto} updatedData - Данные для обновления
 */
type UpdateReviewRequest = {
  reviewId: string;
  updatedData: UpdateFeedbackDto
}

/**
 * Конфигурация API
 */
const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    create: (newData: CreateFeedbackDto) => ({
      url: '/',
      method: 'POST',
      body: newData,
    }),
    get: () => '/',
    update: ({ reviewId, updatedData }: UpdateReviewRequest) => ({
      url: `/${reviewId}`,
      method: 'PUT',
      body: updatedData,
    }),
    delete: (reviewId: string) => ({
      url: `/${reviewId}`,
      method: 'DELETE',
    }),
  },
};

/**
 * Создание API с использованием RTK Query
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  tagTypes: [TAG_REVIEW],
  endpoints: (builder) => ({
    createReview: builder.mutation<Feedback, CreateFeedbackDto>({
      query: (newData) => API_CONFIG.endpoints.create(newData),
      invalidatesTags: [TAG_REVIEW],
    }),
    getReviews: builder.query<Feedback[], void>({
      query: () => API_CONFIG.endpoints.get(),
      providesTags: [TAG_REVIEW],
    }),
    updateReview: builder.mutation<Feedback, UpdateReviewRequest>({
      query: ({ reviewId, updatedData }) => API_CONFIG.endpoints.update({ reviewId, updatedData }),
      invalidatesTags: [TAG_REVIEW],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (reviewId) => API_CONFIG.endpoints.delete(reviewId),
      invalidatesTags: [TAG_REVIEW],
    }),
  }),
});

/**
 * Экспорт хуков для использования в компонентах
 */
export const {
  useCreateReviewMutation,
  useGetReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = api;