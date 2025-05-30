import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Brewery } from '@/app/projects/medium/brewery-finder/features/api';

/**
 * Тип начального состояния для слайса пивоварен.
 * @typedef {Object} InitialState
 * @property {Brewery[]} breweries - Массив всех пивоварен.
 * @property {Brewery[]} breweriesFiltered - Массив отфильтрованных пивоварен.
 */
type InitialState = {
  breweries: Brewery[] | [];
  breweriesFiltered: Brewery[] | [];
}

/**
 * Начальное состояние слайса пивоварен.
 * @type {InitialState}
 */
const initialState: InitialState = {
  breweries: [],
  breweriesFiltered: [],
};

/**
 * Слайс Redux для управления данными о пивоварнях.
 * @type {import('@reduxjs/toolkit').Slice}
 */
const brewerySlice = createSlice({
  name: 'brewery',
  initialState,
  reducers: {
    /**
     * Устанавливает список пивоварен.
     * @param {InitialState} state - Текущее состояние.
     * @param {PayloadAction<Brewery[]>} action - Действие с полезной нагрузкой в виде массива пивоварен.
     */
    setBreweryList: (state, { payload }: PayloadAction<Brewery[]>) => {
      state.breweries = payload;
      state.breweriesFiltered = payload;
    },
    /**
     * Фильтрует список пивоварен по заданному запросу.
     * @param {InitialState} state - Текущее состояние.
     * @param {PayloadAction<string>} action - Действие с полезной нагрузкой в виде строки фильтра.
     */
    setBreweryFilter: (state, { payload }: PayloadAction<string>) => {
      const fieldsToSearch: (keyof Brewery)[] = [
        'name', 'brewery_type', 'address_1', 'address_2',
        'address_3', 'city', 'state_province', 'country',
      ];

      const filterQuery = payload.toLowerCase();

      state.breweriesFiltered = state.breweries.filter((brewery: Brewery) => {
        return fieldsToSearch.some((field: keyof Brewery) => {
          return brewery[field]?.toLowerCase().includes(filterQuery);
        });
      });
    },
  },
});

/**
 * Селектор для получения состояния пивоварен из глобального состояния.
 * @param {Object} state - Глобальное состояние Redux.
 * @param {InitialState} state.brewery - Состояние слайса пивоварен.
 * @returns {InitialState} Состояние слайса пивоварен.
 */
export const selectBreweryState = (state: { brewery: InitialState }): InitialState => {
  return state.brewery;
};

/**
 * Мемоизированный селектор для получения данных о пивоварнях.
 * @type {import('@reduxjs/toolkit').Selector<{brewery: InitialState}, {breweries: Brewery[], breweriesFiltered: Brewery[]}>}
 */
export const selectBreweryData = createSelector(
  selectBreweryState,
  (state) => ({
    breweries: state.breweries,
    breweriesFiltered: state.breweriesFiltered,
  }),
);

/**
 * Экспорт действий для установки списка пивоварен и фильтрации.
 */
export const { setBreweryList, setBreweryFilter } = brewerySlice.actions;

/**
 * Редюсер слайса пивоварен.
 */
export const breweryReducer = brewerySlice.reducer;