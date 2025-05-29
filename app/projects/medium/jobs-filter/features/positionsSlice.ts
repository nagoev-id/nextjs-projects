import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job, JOBS_LIST } from '@/app/projects/medium/jobs-filter/mock';

/**
 * Тип начального состояния для slice позиций
 * @typedef {Object} InitialState
 * @property {Job[]} positions - Массив доступных вакансий
 */
type InitialState = {
  positions: Job[];
}

/**
 * Начальное состояние для slice позиций
 * @type {InitialState}
 */
const initialState: InitialState = {
  positions: JOBS_LIST,
};

/**
 * Slice для управления данными о позициях (вакансиях)
 * @description Содержит редьюсеры для управления списком вакансий
 */
export const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    // Здесь можно добавить редьюсеры, например:
    setPositions: (state, action: PayloadAction<Job[]>) => {
      state.positions = action.payload;
    },
    // Другие редьюсеры по необходимости
  },
});

// Экспорт actions
export const { setPositions } = positionsSlice.actions;

/**
 * Селектор для получения состояния позиций
 * @param {Object} state - Глобальное состояние Redux
 * @param {InitialState} state.positions - Состояние позиций
 * @returns {InitialState} Состояние позиций
 */
export const selectPositionsState = (state: { positions: InitialState }): InitialState => {
  return state.positions;
};

/**
 * Селектор для получения данных о позициях
 * @returns {Object} Объект с массивом позиций
 */
export const selectPositionsData = createSelector(
  selectPositionsState,
  (state) => ({
    positions: state.positions,
  }),
);

/**
 * Селектор для получения отфильтрованных позиций
 * @param {string[]} filters - Массив фильтров для применения
 * @returns {Job[]} Отфильтрованный массив позиций
 */
export const selectVisiblePositions = (filters: string[] = []) =>
  createSelector(
    selectPositionsState,
    (state) => {
      if (filters.length === 0) return state.positions;

      return state.positions.filter(position => {
        const positionFilters = [
          position.role,
          position.level,
          ...(position.languages || []),
          ...(position.tools || []),
        ];
        return filters.every((filter: string) => positionFilters.includes(filter));
      });
    },
  );

// Экспорт reducer для подключения к store
export default positionsSlice.reducer;