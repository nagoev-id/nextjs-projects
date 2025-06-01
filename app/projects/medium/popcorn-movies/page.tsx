'use client';

import { Card } from '@/components/ui/card';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSX, useCallback, useMemo, useState } from 'react';
import {
  FormCollectionSchema,
  formCollectionSchema,
  formSchema,
  FormSchema,
} from '@/app/projects/medium/popcorn-movies/utils';
import { Button, Form, Spinner } from '@/components/ui';
import { FormInput, FormSelect } from '@/components/layout';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/popcorn-movies/app';
import {
  clearSearchResults,
  Film,
  FilmPopular,
  incrementPage,
  resetPage,
  selectMoviesSliceData,
  setSearchQuery,
  setSearchResults,
  useLazyGetByKeywordQuery,
  useLazyGetPopularQuery,
} from '@/app/projects/medium/popcorn-movies/features';
import { toast } from 'sonner';
import { Movie } from '@/app/projects/medium/popcorn-movies/components';
import { useMovieSearch } from '@/app/projects/medium/popcorn-movies/hooks';

type SearchFormProps = {
  form: UseFormReturn<FormSchema>;
  onSubmit: (data: FormSchema) => void;
}

type SearchCollectionFormProps = {
  form: UseFormReturn<FormCollectionSchema>;
  onSubmit: (data: FormCollectionSchema) => void;
  options: { value: string; label: string }[];
}

const COLLECTION_OPTIONS = [
  { value: 'TOP_POPULAR_ALL', label: 'Top popular all' },
  { value: 'TOP_POPULAR_MOVIES', label: 'Top popular movies' },
  { value: 'TOP_250_TV_SHOWS', label: 'Top 50 tv shows' },
  { value: 'TOP_250_MOVIES', label: 'Top 250 movies' },
  { value: 'VAMPIRE_THEME', label: 'Vampire theme' },
  { value: 'COMICS_THEME', label: 'Comics theme' },
  { value: 'CLOSES_RELEASES', label: 'Closes releases' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'OSKAR_WINNERS_2021', label: 'Oskar winners 2021' },
  { value: 'LOVE_THEME', label: 'Love theme' },
  { value: 'ZOMBIE_THEME', label: 'Zombie theme' },
  { value: 'CATASTROPHE_THEME', label: 'Catastrophe theme' },
  { value: 'KIDS_ANIMATION_THEME', label: 'Kids animation theme' },
  { value: 'POPULAR_SERIES', label: 'Popular series' },
];

const SearchForm = ({ form, onSubmit }: SearchFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2.5">
      <FormInput
        name="query"
        placeholder="Enter your search term"
        label="Find your movie"
        form={form}
      />
      <Button type="submit">Search</Button>
    </form>
  </Form>
);

const CollectionForm = ({ form, onSubmit, options }: SearchCollectionFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2.5">
      <FormSelect
        name="collection"
        label="Select collection"
        placeholder="Select a collection"
        form={form}
        selectProps={{ className: 'w-full' }}
        options={options}
      />
      <Button type="submit">Get Collection</Button>
    </form>
  </Form>
);

const PopcornMoviesPage = (): JSX.Element => {
  const [searchByQuery, { isError, isLoading, isSuccess }] = useLazyGetByKeywordQuery();
  const [getPopularMovies, {
    isError: isErrorCollection,
    isLoading: isLoadingCollection,
    isSuccess: isSuccessCollection,
  }] = useLazyGetPopularQuery();

  const { page, searchResults: movies } = useAppSelector(selectMoviesSliceData);
  const dispatch = useAppDispatch();

  // Используем единый объект состояния вместо отдельных переменных
  const [searchState, setSearchState] = useState({
    hasMore: true,
    currentKeyword: '',
    currentCollection: '',
  });

  const { hasMore, currentKeyword, currentCollection } = searchState;

  // Обновление состояния поиска
  const updateSearchState = useCallback((newState: Partial<typeof searchState>) => {
    setSearchState(prev => ({ ...prev, ...newState }));
  }, []);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
    mode: 'onChange',
  });

  const formCollection = useForm<FormCollectionSchema>({
    resolver: zodResolver(formCollectionSchema),
    defaultValues: { collection: '' },
    mode: 'onChange',
  });

  // Используем хук useMovieSearch для поиска по ключевому слову
  const { onSearchSubmit: movieSearchSubmit } = useMovieSearch(formCollection);

  // Обертка для onSearchSubmit, которая обновляет локальное состояние
  const onSearchSubmit = useCallback(async (values: FormSchema) => {
    updateSearchState({ currentCollection: '', currentKeyword: values.query });
    await movieSearchSubmit(values);
  }, [movieSearchSubmit, updateSearchState]);

  const memoizedCollectionOptions = useMemo(() => COLLECTION_OPTIONS, []);

  // Мемоизируем функцию типа-предохранителя
  const isFilm = useCallback((movie: Film | FilmPopular): movie is Film =>
    'filmId' in movie, []);

  const onSearchCollectionSubmit = useCallback(async ({ collection }: FormCollectionSchema) => {
    try {
      dispatch(clearSearchResults());
      dispatch(resetPage());
      updateSearchState({
        currentCollection: collection,
        currentKeyword: '',
      });
      dispatch(setSearchQuery(''));
      const result = await getPopularMovies({ type: collection, page: 1 }).unwrap();
      dispatch(setSearchResults({
        films: result.items,
        isNewSearch: true,
      }));
      updateSearchState({ hasMore: result.items.length > 0 });
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error when searching for movies', { richColors: true });
    }
  }, [getPopularMovies, dispatch, updateSearchState]);

  const loadMore = useCallback(async () => {
    try {
      let result;
      if (currentKeyword) {
        result = await searchByQuery({ keyword: currentKeyword, page: page + 1 }).unwrap();
      } else if (currentCollection) {
        result = await getPopularMovies({ type: currentCollection, page: page + 1 }).unwrap();
      } else {
        return;
      }
      const newFilms = result.films || result.items;
      updateSearchState({ hasMore: newFilms.length > 0 });
      if (newFilms.length > 0) {
        dispatch(incrementPage());
        dispatch(setSearchResults({
          films: newFilms,
          isNewSearch: false,
        }));
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error loading additional movies', { richColors: true });
    }
  }, [currentKeyword, currentCollection, page, searchByQuery, getPopularMovies, dispatch, updateSearchState]);

  const handleClearSearch = useCallback(() => {
    dispatch(clearSearchResults());
    dispatch(resetPage());
    dispatch(setSearchQuery(''));
    updateSearchState({
      currentKeyword: '',
      currentCollection: '',
      hasMore: true,
    });
    form.reset();
    formCollection.reset();
  }, [dispatch, form, formCollection, updateSearchState]);

  const renderMovieList = useCallback(() => {
    if (!movies || movies.length === 0) return null;

    return (
      <div className="grid gap-3">
        <h2 className="text-xl">
          {currentKeyword
            ? `Search results for your query "${currentKeyword}"`
            : `Popular movies from collection: ${currentCollection}`}
        </h2>
        <ul className="grid items-start gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie: Film | FilmPopular) => (
            <Movie
              key={isFilm(movie) ? movie.filmId : movie.kinopoiskId}
              movie={movie}
              isPopular={!isFilm(movie)}
            />
          ))}
        </ul>
        {hasMore && (
          <Button onClick={loadMore} className="mt-4">
            Load more
          </Button>
        )}
      </div>
    );
  }, [movies, currentKeyword, currentCollection, hasMore, loadMore, isFilm]);

  // Оптимизированное отображение состояний загрузки и ошибок
  const renderStatusMessages = useCallback(() => {
    if (isLoading || isLoadingCollection) return <Spinner />;

    if (isError || isErrorCollection) {
      return (
        <p className="text-center font-semibold text-red-500">
          Error when receiving movies. Please try again later.
        </p>
      );
    }

    if ((isSuccess || isSuccessCollection) && (!movies || movies.length === 0)) {
      return (
        <p className="text-center font-semibold text-red-500">No movies found.</p>
      );
    }

    return null;
  }, [isLoading, isLoadingCollection, isError, isErrorCollection, isSuccess, isSuccessCollection, movies]);

  return (
    <Card className="max-w-6xl grid gap-3 w-full mx-auto p-4 rounded">
      <SearchForm form={form} onSubmit={onSearchSubmit} />
      <CollectionForm
        form={formCollection}
        onSubmit={onSearchCollectionSubmit}
        options={memoizedCollectionOptions}
      />

      {movies && movies.length > 0 && (
        <Button onClick={handleClearSearch} variant="outline">
          Clear search
        </Button>
      )}

      {renderStatusMessages()}
      {renderMovieList()}
    </Card>
  );
};

export default PopcornMoviesPage;