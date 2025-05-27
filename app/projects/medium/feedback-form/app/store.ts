import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/app/projects/medium/feedback-form/features';

/**
 * Конфигурация и создание Redux store.
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Настройка слушателей для RTK Query
setupListeners(store.dispatch);

/**
 * Тип для Redux store.
 * @typedef {typeof store} AppStore
 */
export type AppStore = typeof store;

/**
 * Тип корневого состояния Redux.
 * @typedef {ReturnType<AppStore['getState']>} RootState
 */
export type RootState = ReturnType<AppStore['getState']>;

/**
 * Тип для dispatch функции Redux.
 * @typedef {AppStore['dispatch']} AppDispatch
 */
export type AppDispatch = AppStore['dispatch'];

/**
 * Хук для доступа к функции dispatch в компонентах.
 * @function
 * @returns {AppDispatch} Функция dispatch
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Типизированный хук useSelector для выбора данных из Redux store.
 * @function
 * @template TSelected Тип выбираемых данных
 * @param {function(RootState): TSelected} selector Функция-селектор
 * @returns {TSelected} Выбранные данные из store
 */
export const useAppSelector: <TSelected>(selector: (state: RootState) => TSelected) => TSelected = useSelector;