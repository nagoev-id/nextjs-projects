import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookItem, Books } from '@/app/projects/medium/book-hub/features/api';

/**
 * @constant {string} STORAGE_KEY
 * @description Ключ для хранения избранных книг в localStorage
 */
const STORAGE_KEY = 'favoriteBooks';

/**
 * @function getFavoriteBooks
 * @description Получает список избранных книг из localStorage
 * @returns {Books} Массив избранных книг
 */
const getFavoriteBooks = (): Books => {
  if (typeof window !== 'undefined') {
    try {
      const storedBooks = localStorage.getItem(STORAGE_KEY);
      return storedBooks ? JSON.parse(storedBooks) : [];
    } catch (error) {
      console.error('Error when receiving selected books:', error);
      return [];
    }
  }
  return [];
};

/**
 * @function saveFavoriteBooks
 * @description Сохраняет список избранных книг в localStorage
 * @param {Books} books - Массив книг для сохранения
 */
const saveFavoriteBooks = (books: Books): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Error when receiving selected books:', error);
    }
  }
};

/**
 * @typedef {Object} RootState
 * @description Тип для корневого состояния Redux
 * @property {InitialState} books - Состояние слайса книг
 */
export type RootState = {
  books: InitialState;
};

/**
 * @typedef {Object} InitialState
 * @description Начальное состояние для слайса книг
 * @property {Books} favorites - Массив избранных книг
 */
type InitialState = {
  favorites: Books;
}

/**
 * @constant {InitialState} initialState
 * @description Начальное состояние слайса книг
 */
const initialState: InitialState = {
  favorites: getFavoriteBooks(),
};

/**
 * @constant {Object} booksSlice
 * @description Redux слайс для управления избранными книгами
 */
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    /**
     * @function addFavorite
     * @description Добавляет книгу в избранное
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<BookItem>} action - Action с данными книги
     */
    addFavorite: (state, action: PayloadAction<BookItem>) => {
      // Проверяем, не добавлена ли уже книга в избранное
      if (!state.favorites.some(book => book.id === action.payload.id)) {
        state.favorites.push(action.payload);
        saveFavoriteBooks(state.favorites);
      }
    },

    /**
     * @function removeFavorite
     * @description Удаляет книгу из избранного
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Action с ID книги
     */
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(book => book.id !== action.payload);
      saveFavoriteBooks(state.favorites);
    },

    /**
     * @function clearFavorites
     * @description Очищает весь список избранных книг
     * @param {InitialState} state - Текущее состояние
     */
    clearFavorites: (state) => {
      state.favorites = [];
      saveFavoriteBooks([]);
    },
  },
});

/**
 * @function selectBooksSliceState
 * @description Селектор для получения состояния слайса книг
 * @param {RootState} state - Корневое состояние Redux
 * @returns {InitialState} Состояние слайса книг
 */
export const selectBooksSliceState = (state: RootState): InitialState => state.books;

/**
 * @constant {Function} selectBooksSliceData
 * @description Мемоизированный селектор для получения данных из слайса книг
 */
export const selectBooksSliceData = createSelector(
  selectBooksSliceState,
  (state) => ({
    favorites: state.favorites,
  }),
);

/**
 * @constant {Function} selectIsFavorite
 * @description Мемоизированный селектор для проверки, находится ли книга в избранном
 * @param {string} bookId - ID книги для проверки
 */
export const selectIsFavorite = (bookId: string) => createSelector(
  selectBooksSliceState,
  (state) => state.favorites.some(book => book.id === bookId),
);

export const { removeFavorite, addFavorite, clearFavorites } = booksSlice.actions;

export const booksSliceReducer = booksSlice.reducer;