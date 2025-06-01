import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteMovie, FavoriteMovies } from '@/app/projects/medium/popcorn-movies/features/api';

/**
 * @constant {string} STORAGE_KEY
 * @description Ключ для хранения избранных книг в localStorage
 */
const STORAGE_KEY = 'favoriteMovies';

/**
 * @function getFavoriteMovies
 * @description Получает список избранных книг из localStorage
 * @returns {FavoriteMovies} Массив избранных книг
 */
const getFavoriteMovies = (): FavoriteMovies => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error when receiving selected movies:', error);
      return [];
    }
  }
  return [];
};

/**
 * @function saveFavoriteMovies
 * @description Сохраняет список избранных книг в localStorage
 * @param {FavoriteMovies} movies - Массив книг для сохранения
 */
const saveFavoriteMovies = (movies: FavoriteMovies): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch (error) {
      console.error('Error when receiving selected movies:', error);
    }
  }
};

type InitialState = {
  favorites: FavoriteMovies;
  searchResults: FavoriteMovies;
  page: number;
  searchQuery: string;
}

const initialState: InitialState = {
  favorites: getFavoriteMovies(),
  searchResults: [],
  page: 1,
  searchQuery: '',
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<{ films: FavoriteMovies; isNewSearch: boolean }>) => {
      state.searchResults = action.payload.isNewSearch ? action.payload.films : [...state.searchResults, ...action.payload.films];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPage: (state) => {
      state.page = 1;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    addFavorite: (state, action: PayloadAction<FavoriteMovie>) => {
      const newFavorite = action.payload;
      const isAlreadyFavorite = state.favorites.some(movie =>
        ('filmId' in movie && 'filmId' in newFavorite && movie.filmId === newFavorite.filmId) ||
        ('kinopoiskId' in movie && 'kinopoiskId' in newFavorite && movie.kinopoiskId === newFavorite.kinopoiskId),
      );

      if (!isAlreadyFavorite) {
        state.favorites.push(newFavorite);
        saveFavoriteMovies(state.favorites);
      } else {
        console.log(`Movie with id ${('filmId' in newFavorite ? newFavorite.filmId : newFavorite.kinopoiskId)} already in favorites`);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(movie =>
        ('filmId' in movie && movie.filmId !== action.payload) ||
        ('kinopoiskId' in movie && movie.kinopoiskId !== action.payload),
      );
      saveFavoriteMovies(state.favorites);
    },
    updateFavorite: (state, action: PayloadAction<FavoriteMovie>) => {
      const index = state.favorites.findIndex(movie =>
        ('filmId' in movie && 'filmId' in action.payload && movie.filmId === action.payload.filmId) ||
        ('kinopoiskId' in movie && 'kinopoiskId' in action.payload && movie.kinopoiskId === action.payload.kinopoiskId),
      );
      if (index !== -1) {
        state.favorites[index] = action.payload;
        saveFavoriteMovies(state.favorites);
      }
    },
  },
});


export const selectMoviesSliceState = (state: { movies: InitialState }): InitialState => {
  return state.movies;
};

export const selectMoviesSliceData = createSelector(
  selectMoviesSliceState,
  (state) => ({
    favorites: state.favorites,
    searchResults: state.searchResults,
    page: state.page,
    searchQuery: state.searchQuery,
  }),
);

export const {
  removeFavorite,
  addFavorite,
  updateFavorite,
  setSearchQuery,
  setSearchResults,
  clearSearchResults,
  incrementPage,
  resetPage,
} = moviesSlice.actions;

export const moviesReducer = moviesSlice.reducer;