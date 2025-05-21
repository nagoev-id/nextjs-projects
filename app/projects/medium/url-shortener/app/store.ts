/**
 * @fileoverview Конфигурация Redux-хранилища для приложения URL Shortener
 * @module store
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { shortenerSlice, urlShortenerApi } from '@/app/projects/medium/url-shortener/features';

/**
 * Конфигурация и создание Redux-хранилища
 * 
 * @constant {Object} store - Глобальное Redux-хранилище приложения
 * 
 * @property {Object} reducer - Комбинированный редьюсер, объединяющий все слайсы
 * @property {Function} reducer[urlShortenerApi.reducerPath] - Редьюсер для RTK Query API
 * @property {Function} reducer.shortener - Редьюсер для хранения сокращенных URL
 * 
 * @property {Function} middleware - Настройка middleware с добавлением RTK Query middleware
 * для обработки кэширования, инвалидации и других аспектов работы с API
 */
export const store = configureStore({
  reducer: {
    [urlShortenerApi.reducerPath]: urlShortenerApi.reducer,
    shortener: shortenerSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(urlShortenerApi.middleware),
});

/**
 * Настройка слушателей событий для RTK Query
 * 
 * Включает автоматическую перезагрузку данных при определенных событиях браузера
 * 
 * @function setupListeners
 * @param {Function} dispatch - Функция dispatch из Redux-хранилища
 */
setupListeners(store.dispatch);

/**
 * Тип корневого состояния Redux
 * 
 * Автоматически выводится из типа возвращаемого значения getState
 * Используется для типизации селекторов и хуков useSelector
 * 
 * @typedef {ReturnType<typeof store.getState>} RootState
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Тип функции dispatch для Redux-хранилища
 * 
 * Используется для типизации хука useDispatch и thunk-функций
 * 
 * @typedef {typeof store.dispatch} AppDispatch
 */
export type AppDispatch = typeof store.dispatch;