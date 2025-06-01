import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { incrementPage, resetPage, setSearchResults } from '@/app/projects/medium/popcorn-movies/features/slice';


type Country = {
  country: string;
};

type Genre = {
  genre: string;
};

export type BaseFilm = {
  kinopoiskId: number;
  nameRu: string;
  nameEn: string | null;
  nameOriginal: string;
  posterUrl: string;
  posterUrlPreview: string;
  coverUrl: string;
  logoUrl: string;
  ratingKinopoisk: number;
  ratingImdb: number;
  ratingAgeLimits: string;
  year: number;
  type: 'FILM' | 'TV_SERIES' | 'VIDEO' | string;
  description: string;
  countries: Country[];
  genres: Genre[];
}

export type Film = BaseFilm & {
  filmId: number;
  filmLength: string;
  userRating?: number;
}

export type FilmPopular = BaseFilm & {
  imdbId?: string;
}

export type FavoriteMovie = Film | FilmPopular;

export type FavoriteMovies = FavoriteMovie[];

export type DetailedFilm = Film & {
  distributorRelease: string;
  distributors: string;
  facts: string[];
  premiereBluRay: string | null;
  premiereDigital: string | null;
  premiereDvd: string | null;
  premiereRu: string | null;
  premiereWorld: string | null;
  premiereWorldCountry: string | null;
  ratingMpaa: string | null;
  seasons: any[];
  slogan: string | null;
  webUrl: string;
};

export type SearchResult = {
  keyword: string;
  pagesCount: number;
  searchFilmsCountResult: number;
  films: Film[];
};

export type CollectionResult = {
  total: number;
  totalPages: number;
  items: FilmPopular[];
};

export type ApiError = {
  status: number;
  data: {
    message: string;
    error: string;
  };
};


// Конфигурация API
const API_CONFIG = {
  baseUrl: 'https://kinopoiskapiunofficial.tech/api/',
  apiKey: 'dc4dfbe2-75ab-439e-b232-8b9f27863292',
  endpoints: {
    readByKeyword: (keyword: string, page: string) => ({
      url: '/v2.1/films/search-by-keyword',
      params: { keyword, page },
    }),
    readDetail: (id: number) => ({
      url: `/v2.2/films/${id}`,
    }),
    readPopular: (type: string, page: number = 1) => ({
      url: '/v2.2/films/collections',
      params: { type, page },
    }),
  },
};

const handleQueryResults = async ({ page, queryFulfilled, dispatch, isPopular = false }) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(setSearchResults({
      films: isPopular ? data.items : data.films,
      isNewSearch: page === 1,
    }));

    if (page === 1) {
      dispatch(resetPage());
    } else {
      dispatch(incrementPage());
    }
    return { data };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error('Error while fetching data:', apiError);

    if (apiError.status === 401) {
      console.error('Invalid API key. Please check your API key.');
    } else if (apiError.status === 403) {
      console.error('Access denied. Check your API key permissions.');
    }

    throw error;
  }
};

// Создание API с использованием RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: (headers) => {
      headers.set('X-API-KEY', API_CONFIG.apiKey);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getByKeyword: builder.query<SearchResult, { keyword: string; page: number }>({
      query: ({ keyword, page }) => API_CONFIG.endpoints.readByKeyword(keyword, String(page)),
      async onQueryStarted({ page }, { queryFulfilled, dispatch }) {
        return handleQueryResults({ page, queryFulfilled, dispatch });
      },
      keepUnusedDataFor: 300,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.keyword}-${queryArgs.page}`;
      },
      merge: (currentCache, newItems) => {
        if (newItems.pagesCount === 1) {
          return newItems;
        }
        return {
          ...currentCache,
          films: [...currentCache.films, ...newItems.films],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getDetail: builder.query<DetailedFilm, number>({
      query: (id) => API_CONFIG.endpoints.readDetail(id),
      keepUnusedDataFor: 3600,
    }),

    getPopular: builder.query<CollectionResult, { type: string; page: number }>({
      query: ({ type, page = 1 }) => API_CONFIG.endpoints.readPopular(type, page),
      async onQueryStarted({ page, type }, { queryFulfilled, dispatch }) {
        return handleQueryResults({ page, queryFulfilled, dispatch, isPopular: true });
      },
      keepUnusedDataFor: 300,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.type}-${queryArgs.page}`;
      },
      merge: (currentCache, newItems) => {
        if (newItems.totalPages === 1) {
          return newItems;
        }
        return {
          ...currentCache,
          items: [...currentCache.items, ...newItems.items],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});


// Экспорт хуков для использования в компонентах
export const { useLazyGetByKeywordQuery, useLazyGetDetailQuery, useLazyGetPopularQuery } = api;