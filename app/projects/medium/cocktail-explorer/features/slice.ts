import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Drink } from '@/app/projects/medium/cocktail-explorer/utils';

/**
 * @typedef {Object} InitialState
 * @description Тип состояния для слайса коктейлей
 * @property {Drink[]} drinks - Массив всех доступных коктейлей
 * @property {Drink[]} randomDrinks - Массив случайно выбранных коктейлей
 * @property {Drink[]|null} searchResults - Результаты поиска коктейлей или null, если поиск не выполнялся
 * @property {Drink|null} currentDrink - Текущий выбранный коктейль или null, если ничего не выбрано
 */
type InitialState = {
  drinks: Drink[];
  randomDrinks: Drink[];
  searchResults: Drink[] | null;
  currentDrink: Drink | null;
}

/**
 * @description Начальное состояние для слайса коктейлей
 * @type {InitialState}
 */
const initialState: InitialState = {
  drinks: [],
  randomDrinks: [],
  searchResults: null,
  currentDrink: null,
};

/**
 * @description Redux слайс для управления данными о коктейлях
 * @see https://redux-toolkit.js.org/api/createSlice - Документация по createSlice
 */
const drinksSlice = createSlice({
  name: 'drinks',
  initialState,
  reducers: {
    /**
     * @description Устанавливает список всех коктейлей
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<Drink[]>} action - Action с массивом коктейлей
     */
    setDrinks: (state, { payload }: PayloadAction<Drink[]>) => {
      state.drinks = payload;
    },
    
    /**
     * @description Устанавливает список случайных коктейлей
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<Drink[]>} action - Action с массивом коктейлей
     */
    setRandomDrinks: (state, { payload }: PayloadAction<Drink[]>) => {
      state.randomDrinks = [...payload].sort(() => 0.5 - Math.random()).slice(0, 20);
    },
    
    /**
     * @description Устанавливает результаты поиска коктейлей
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<Drink[]|null>} action - Action с результатами поиска или null
     */
    setSearchResults: (state, { payload }: PayloadAction<Drink[] | null>) => {
      state.searchResults = payload;
    },
    
    /**
     * @description Выполняет поиск коктейлей по заданной строке
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Action со строкой поиска
     */
    searchDrinks: (state, { payload }: PayloadAction<string>) => {
      const lowercaseQuery = payload.toLowerCase();
      state.searchResults = state.drinks.filter((drink: Drink) => {
        return (
          drink.strDrink.toLowerCase().includes(lowercaseQuery) ||
          drink.strCategory.toLowerCase().includes(lowercaseQuery) ||
          drink.strAlcoholic.toLowerCase().includes(lowercaseQuery) ||
          drink.strGlass.toLowerCase().includes(lowercaseQuery) ||
          (drink.strIngredient1 && drink.strIngredient1.toLowerCase().includes(lowercaseQuery)) ||
          (drink.strIngredient2 && drink.strIngredient2.toLowerCase().includes(lowercaseQuery)) ||
          (drink.strIngredient3 && drink.strIngredient3.toLowerCase().includes(lowercaseQuery)) ||
          (drink.strIngredient4 && drink.strIngredient4.toLowerCase().includes(lowercaseQuery)) ||
          (drink.strIngredient5 && drink.strIngredient5.toLowerCase().includes(lowercaseQuery))
        );
      });
    },
  },
});

/**
 * @description Селектор для получения всего состояния слайса коктейлей
 * @param {Object} state - Состояние Redux
 * @param {InitialState} state.drinks - Состояние слайса коктейлей
 * @returns {InitialState} Состояние слайса коктейлей
 */
export const selectDrinksSliceState = (state: { drinks: InitialState }): InitialState => {
  return state.drinks;
};

/**
 * @description Мемоизированный селектор для получения данных о коктейлях
 * @see https://redux-toolkit.js.org/api/createSelector - Документация по createSelector
 * @returns {Object} Объект с данными о коктейлях
 * @example
 * // Использование в компоненте
 * const { drinks, randomDrinks, searchResults } = useSelector(selectDrinksSliceData);
 */
export const selectDrinksSliceData = createSelector(
  selectDrinksSliceState,
  (state) => ({
    drinks: state.drinks,
    randomDrinks: state.randomDrinks,
    searchResults: state.searchResults,
    currentDrink: state.currentDrink,
  }),
);

/**
 * @description Экспорт действий (actions) из слайса коктейлей
 */
export const { setDrinks, setRandomDrinks, searchDrinks, setSearchResults } = drinksSlice.actions;

/**
 * @description Редьюсер слайса коктейлей для использования в Redux store
 */
export const drinksSliceReducer = drinksSlice.reducer;