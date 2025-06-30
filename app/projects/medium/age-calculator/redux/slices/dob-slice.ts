import { createSelector, createSlice } from '@reduxjs/toolkit';
import { AgeResult, formatDate, FunFacts } from '@/app/projects/medium/age-calculator/utils';

/**
 * @typedef {Object} ResultType
 * @property {AgeResult} age - Результат расчета возраста
 * @property {FunFacts} funFacts - Интересные факты
 * @property {string} birthDate - Дата рождения в формате строки
 * @property {string} currentDate - Текущая дата в формате строки
 */
type ResultType = {
  age: AgeResult;
  funFacts: FunFacts;
  birthDate: string;
  currentDate: string;
}

const date = new Date();

/**
 * @interface InitialState
 * @description Интерфейс начального состояния для слайса dob
 */
interface InitialState {
  /** Текущая дата */
  currentDate: {
    day: string;
    month: string;
    year: string;
    isoDate: string;
  };
  /** Результат расчета */
  result?: ResultType | null;
  /** Обратный отсчет */
  countdown: string;
  /** Флаг открытия */
  isOpen?: boolean;
  /** Выбранная дата */
  date: string;
  /** Выбранный месяц */
  month: string;
  /** Значение в формате строки */
  value: string;
}

/**
 * @type {InitialState}
 * @description Начальное состояние для слайса dob
 */
const initialState: InitialState = {
  currentDate: {
    day: date.getDate().toString(),
    month: (date.getMonth() + 1).toString(),
    year: date.getFullYear().toString(),
    isoDate: date.toISOString().split('T')[0],
  },
  result: null,
  countdown: '',
  isOpen: false,
  date: date.toISOString(),
  month: date.toISOString(),
  value: formatDate(date),
};
/**
 * @description Слайс Redux для управления состоянием даты рождения
 */
const dobSlice = createSlice({
  name: 'dob',
  initialState,
  reducers: {
    /**
     * @description Устанавливает флаг открытия
     * @param {InitialState} state - Текущее состояние
     * @param {Object} action - Действие Redux
     * @param {boolean} action.payload - Новое значение флага
     */
    setIsOpen: (state, { payload }) => {
      state.isOpen = payload;
    },

    /**
     * @description Устанавливает значение обратного отсчета
     * @param {InitialState} state - Текущее состояние
     * @param {Object} action - Действие Redux
     * @param {string} action.payload - Новое значение обратного отсчета
     */
    setCountdown: (state, { payload }) => {
      state.countdown = payload;
    },

    /**
     * @description Устанавливает результат расчета возраста
     * @param {InitialState} state - Текущее состояние
     * @param {Object} action - Действие Redux
     * @param {ResultType | null} action.payload - Новый результат расчета или null
     */
    setResult: (state, { payload }) => {
      if (payload) {
        state.result = {
          ...payload,
          birthDate: payload.birthDate instanceof Date ? payload.birthDate.toISOString() : payload.birthDate,
          currentDate: payload.currentDate instanceof Date ? payload.currentDate.toISOString() : payload.currentDate,
        };
      } else {
        state.result = payload;
      }
    },

    /**
     * @description Устанавливает значение в формате строки
     * @param {InitialState} state - Текущее состояние
     * @param {Object} action - Действие Redux
     * @param {string} action.payload - Новое значение
     */
    setValue: (state, { payload }) => {
      state.value = payload;
    },

    /**
     * @description Устанавливает выбранный месяц
     * @param {InitialState} state - Текущее состояние
     * @param {Object} action - Действие Redux
     * @param {Date | string} action.payload - Новое значение месяца
     */
    setMonth: (state, { payload }) => {
      // Конвертация Date в строку при необходимости
      state.month = payload instanceof Date ? payload.toISOString() : payload;
    },

    /**
     * @description Устанавливает выбранную дату
     * @param {InitialState} state - Текущее состояние
     * @param {Object} action - Действие Redux
     * @param {Date | string} action.payload - Новое значение даты
     */
    setDate: (state, { payload }) => {
      // Конвертация Date в строку при необходимости
      state.date = payload instanceof Date ? payload.toISOString() : payload;
    },

    /**
     * @description Сбрасывает состояние к начальному
     * @returns {InitialState} Начальное состояние
     */
    resetDob: () => initialState,
  },
});

/**
 * @description Селектор для получения данных dob
 * @param {Object} state - Состояние Redux
 * @returns {InitialState} Данные dob
 */
export const selectDobData = createSelector(
  (state: { dobReducer: InitialState }): InitialState => state.dobReducer,
  ({ currentDate, result, countdown, isOpen, date, month, value }) => ({
    currentDate,
    result,
    countdown,
    isOpen,
    date,
    month,
    value,
  }),
);

/**
 * @description Селектор для получения дат в виде объектов Date
 * @param {Object} state - Состояние Redux
 * @returns {Object} Объект с датами в виде объектов Date
 */
export const selectDobDatesAsObjects = createSelector(
  selectDobData,
  ({ date, month, result }) => ({
    date: date ? new Date(date) : undefined,
    month: month ? new Date(month) : undefined,
    birthDate: result?.birthDate ? new Date(result.birthDate) : undefined,
    currentDate: result?.currentDate ? new Date(result.currentDate) : undefined,
  }),
);

export const { setIsOpen, setCountdown, setResult, setValue, setMonth, setDate, resetDob } = dobSlice.actions;

export const dobReducer = dobSlice.reducer;