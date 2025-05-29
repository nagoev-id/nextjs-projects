import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * @typedef {Object} InitialState
 * @property {string[]} filters - Массив строк, представляющих активные фильтры
 */
type InitialState = {
  filters: string[];
}

/**
 * @type {InitialState}
 * @description Начальное состояние для среза фильтров
 */
const initialState: InitialState = {
  filters: [],
};

/**
 * @description Срез Redux для управления фильтрами
 */
export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    /**
     * @description Добавляет новый фильтр, если он еще не существует
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Действие с полезной нагрузкой типа string
     */
    addFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.includes(action.payload) ? state.filters : [...state.filters, action.payload];
    },
    /**
     * @description Удаляет указанный фильтр из массива
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Действие с полезной нагрузкой типа string
     */
    removeFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.filter((filter) => filter !== action.payload);
    },
    /**
     * @description Очищает все фильтры
     * @param {InitialState} state - Текущее состояние
     */
    clearFilters: (state) => {
      state.filters = [];
    },
  },
});

/**
 * @description Селектор для получения состояния фильтров
 * @param {Object} state - Глобальное состояние Redux
 * @param {InitialState} state.filters - Состояние фильтров
 * @returns {InitialState} Состояние фильтров
 */
export const selectFiltersState = (state: { filters: InitialState }): InitialState => {
  return state.filters;
};

/**
 * @description Мемоизированный селектор для получения данных фильтров
 */
export const selectFiltersData = createSelector(
  selectFiltersState,
  (state) => ({
    filters: state.filters,
  }),
);

/**
 * @description Экспорт действий для использования в компонентах
 */
export const { addFilter, removeFilter, clearFilters } = filtersSlice.actions;

/**
 * @description Экспорт редьюсера для использования в store
 */
export default filtersSlice.reducer;