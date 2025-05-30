import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { api, breweryReducer } from '@/app/projects/medium/brewery-finder/features';

/**
 * Конфигурация и создание Redux store.
 * @description Создает Redux store с использованием RTK Query и пользовательских редюсеров.
 * @see {@link https://redux-toolkit.js.org/api/configureStore}
 */
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    brewery: breweryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

/**
 * Настройка слушателей для RTK Query.
 * @description Устанавливает слушатели для автоматического рефетчинга при определенных действиях пользователя.
 * @see {@link https://redux-toolkit.js.org/rtk-query/api/setupListeners}
 */
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
 * Типизированный хук useDispatch.
 * @description Предоставляет типизированную версию хука useDispatch для использования в компонентах.
 * @returns {AppDispatch} Типизированная функция dispatch.
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(someAction());
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Типизированный хук useSelector.
 * @description Предоставляет типизированную версию хука useSelector для использования в компонентах.
 * @template TSelected Тип выбираемого значения из состояния.
 * @param {function(state: RootState): TSelected} selector Функция селектора.
 * @returns {TSelected} Выбранное значение из состояния.
 * @example
 * const someValue = useAppSelector(state => state.someSlice.someValue);
 */
export const useAppSelector: <TSelected>(selector: (state: RootState) => TSelected) => TSelected = useSelector;