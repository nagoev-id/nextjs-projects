import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hints } from '@/app/projects/medium/hacker-news-search/features/api';

/**
 * @typedef {Object} InitialState
 * @description Тип начального состояния для поиска новостей Hacker News
 * @property {Hints} hits - Массив найденных новостей
 * @property {string} query - Поисковый запрос
 * @property {number} page - Текущая страница результатов
 * @property {number} nbPages - Общее количество страниц результатов
 */
type InitialState = {
  hits: Hints;
  query: string;
  page: number;
  nbPages: number;
}

/**
 * @typedef {'increase' | 'decrease'} PageDirection
 * @description Тип для направления изменения страницы
 */
type PageDirection = 'increase' | 'decrease';

/**
 * @typedef {Object} NewsPayload
 * @description Тип данных для обновления новостей
 * @property {Hints} hits - Массив найденных новостей
 * @property {number} nbPages - Общее количество страниц результатов
 */
type NewsPayload = {
  hits: Hints;
  nbPages: number;
};

/**
 * @constant {InitialState} initialState
 * @description Начальное состояние для slice Hacker News
 */
const initialState: InitialState = {
  hits: [],
  query: 'react',
  page: 0,
  nbPages: 0,
};

/**
 * @constant {Slice} hackerNewsSlice
 * @description Redux slice для управления состоянием поиска новостей Hacker News
 */
const hackerNewsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    /**
     * @function setNews
     * @description Устанавливает найденные новости и общее количество страниц
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<NewsPayload>} action - Действие с данными новостей
     */
    setNews: (state, { payload }: PayloadAction<NewsPayload>) => {
      state.hits = payload.hits;
      state.nbPages = payload.nbPages;
    },

    /**
     * @function removeNews
     * @description Удаляет новость из списка по её идентификатору
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Действие с ID новости для удаления
     */
    removeNews: (state, { payload }: PayloadAction<string>) => {
      state.hits = state.hits.filter((hit) => hit.objectID !== payload);
    },

    /**
     * @function handlePage
     * @description Изменяет текущую страницу результатов (увеличивает или уменьшает)
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<PageDirection>} action - Направление изменения страницы
     */
    handlePage: (state, { payload }: PayloadAction<PageDirection>) => {
      const isDecrease = payload === 'decrease';
      const change = isDecrease ? -1 : 1;
      state.page = Math.max(0, Math.min(state.page + change, state.nbPages - 1));
    },

    /**
     * @function setQuery
     * @description Устанавливает новый поисковый запрос
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Действие с новым поисковым запросом
     */
    setQuery: (state, { payload }: PayloadAction<string>) => {
      state.query = payload;
    },

    /**
     * @function resetPage
     * @description Сбрасывает номер текущей страницы на начальную (0)
     * @param {InitialState} state - Текущее состояние
     */
    resetPage: (state) => {
      state.page = 0;
    },
  },
});

/**
 * @function selectHackerNewsState
 * @description Базовый селектор для получения состояния Hacker News из глобального состояния Redux
 * @param {Object} state - Глобальное состояние Redux
 * @param {InitialState} state.hackerNews - Состояние Hacker News
 * @returns {InitialState} Состояние Hacker News
 */
export const selectHackerNewsState = (state: { hackerNews: InitialState }): InitialState => {
  return state.hackerNews;
};

/**
 * @constant selectHackerNewsData
 * @description Мемоизированный селектор для получения данных Hacker News
 * @returns {Object} Объект с данными hits, query, page и nbPages
 */
export const selectHackerNewsData = createSelector(
  selectHackerNewsState,
  (state) => ({
    hits: state.hits,
    query: state.query,
    page: state.page,
    nbPages: state.nbPages,
  }),
);

export const { setNews, removeNews, setQuery, resetPage, handlePage } = hackerNewsSlice.actions;

export const hackerNewsReducer = hackerNewsSlice.reducer;