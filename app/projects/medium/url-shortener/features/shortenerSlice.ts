/**
 * @fileoverview Слайс Redux для управления сокращенными URL
 * 
 * Этот модуль определяет структуру данных, начальное состояние, редьюсеры и селекторы
 * для работы с сокращенными URL в приложении. Он использует createSlice из Redux Toolkit
 * для упрощения создания действий и редьюсеров.
 * 
 * @module shortenerSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Тип данных для сокращенного URL
 * 
 * @typedef {Object} UrlResponse
 * @property {string} created_at - Дата и время создания сокращенного URL в ISO формате
 * @property {string} tiny_url - Сокращенный URL, полученный от API
 */
type UrlResponse = {
  created_at: string;
  tiny_url: string;
}

/**
 * Тип для состояния слайса
 * 
 * @typedef {Object} InitialState
 * @property {UrlResponse[]} shortenedUrls - Массив сокращенных URL с метаданными
 */
type InitialState = {
  shortenedUrls: UrlResponse[];
}

/**
 * Начальное состояние слайса - пустой массив сокращенных URL
 * 
 * @type {InitialState}
 */
const initialState: InitialState = {
  shortenedUrls: [],
};

/**
 * Слайс Redux для управления сокращенными URL
 * 
 * @constant {Object} shortenerSlice
 * @property {string} name - Имя слайса для идентификации в Redux DevTools
 * @property {InitialState} initialState - Начальное состояние слайса
 * @property {Object} selectors - Объект с селекторами для доступа к данным слайса
 * @property {Object} reducers - Объект с редьюсерами для изменения состояния
 */
export const shortenerSlice = createSlice({
  name: 'shortener',
  initialState,
  /**
   * Селекторы для доступа к данным слайса
   * 
   * @property {Function} selectShortenedUrls - Селектор для получения списка сокращенных URL
   * @param {InitialState} state - Текущее состояние слайса
   * @returns {UrlResponse[]} Массив сокращенных URL
   */
  selectors: {
    selectShortenedUrls: (state: InitialState) => state.shortenedUrls,
  },
  /**
   * Редьюсеры для изменения состояния слайса
   */
  reducers: {
    /**
     * Добавляет новый сокращенный URL в список, если он еще не существует
     * 
     * @function addShortenedUrl
     * @param {InitialState} state - Текущее состояние слайса
     * @param {PayloadAction<UrlResponse>} action - Действие с данными нового URL
     */
    addShortenedUrl: (state, action: PayloadAction<UrlResponse>) => {
      // Проверяем, существует ли уже такой URL в списке
      const exists = state.shortenedUrls.some(url => url.tiny_url === action.payload.tiny_url);
      // Добавляем URL только если его еще нет в списке
      if (!exists) {
        state.shortenedUrls.push(action.payload);
      }
    },
  },
});

/**
 * Экспорт действий для использования в компонентах
 */
export const { addShortenedUrl } = shortenerSlice.actions;

/**
 * Экспорт редьюсера для использования в конфигурации хранилища
 */
export default shortenerSlice.reducer;