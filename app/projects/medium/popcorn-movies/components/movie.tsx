'use client';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/popcorn-movies/app';
import {
  addFavorite,
  Film,
  FilmPopular,
  removeFavorite,
  selectMoviesSliceData,
  updateFavorite,
  useLazyGetDetailQuery,
} from '@/app/projects/medium/popcorn-movies/features';
import { JSX, memo, useCallback, useMemo, useState } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { InteractiveRating, MovieDialog } from '@/app/projects/medium/popcorn-movies/components';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import Image from 'next/image';

type MovieProps = {
  movie: Film | FilmPopular;
  isHome?: boolean;
  isPopular?: boolean;
}

// Вспомогательная функция для определения типа фильма
const isKinopoiskMovie = (movie: Film | FilmPopular): boolean => 'kinopoiskId' in movie;

// Вспомогательная функция для получения ID фильма
const getMovieId = (movie: Film | FilmPopular): number | undefined => {
  if (isKinopoiskMovie(movie)) {
    return movie.kinopoiskId;
  } else if ('filmId' in movie) {
    return movie.filmId;
  }
  return undefined;
};

const Movie = ({ movie, isHome = true }: MovieProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { favorites: favoriteMovies } = useAppSelector(selectMoviesSliceData);
  const [getMovieDetails, { data: movieDetails, isLoading: isLoadingDetails }] = useLazyGetDetailQuery();

  // Мемоизируем ID фильма, чтобы не вычислять его каждый раз
  const movieId = useMemo(() => getMovieId(movie), [movie]);

  // Мемоизируем проверку наличия фильма в избранном
  const isMovieInFavorites = useMemo(() => 
    favoriteMovies.some((item: Film | FilmPopular) => {
      const itemId = getMovieId(item);
      return itemId !== undefined && itemId === movieId;
    }),
  [favoriteMovies, movieId]);

  // Мемоизируем обработчики событий
  const handleAddMovie = useCallback(() => {
    dispatch(addFavorite(movie));
  }, [dispatch, movie]);

  const handleRemoveMovie = useCallback(() => {
    if (movieId !== undefined) {
      dispatch(removeFavorite(movieId));
    }
  }, [dispatch, movieId]);

  const handleRatingChange = useCallback((newRating: number) => {
    dispatch(updateFavorite({ ...movie, userRating: newRating }));
  }, [dispatch, movie]);

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
    if (movieId !== undefined) {
      getMovieDetails(movieId);
    }
  }, [getMovieDetails, movieId]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
  }, []);

  // Мемоизируем данные для отображения
  const movieTitle = useMemo(() => movie.nameEn || movie.nameRu || 'Untitled Movie', [movie.nameEn, movie.nameRu]);
  const posterUrl = useMemo(() => movie.posterUrl || movie.posterUrlPreview || '/placeholder-image.jpg', [movie.posterUrl, movie.posterUrlPreview]);
  const initialRating = useMemo(() => 'userRating' in movie ? movie.userRating || 0 : 0, [movie]);

  // Мемоизируем компонент с информацией о фильме
  const MovieInfo = memo(() => (
    <>
      <h3 className="font-semibold text-md line-clamp-2">{movieTitle}</h3>
      <div className="space-y-1 text-sm text-muted-foreground">
        {movie.year && movie.year !== 0 && (
          <p className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {movie.year}
          </p>
        )}
        {'filmLength' in movie && movie.filmLength && (
          <p className="flex items-center">
            <ClockIcon className="mr-2 h-4 w-4" />
            {movie.filmLength}
          </p>
        )}
        {!isHome && (
          <InteractiveRating
            initialRating={initialRating}
            onRatingChange={handleRatingChange}
          />
        )}
        {movie.type && <Badge className="mt-2">{movie.type}</Badge>}
      </div>
    </>
  ));
  
  MovieInfo.displayName = 'MovieInfo';
  
  return (
    <li className="">
      <Card className="h-full overflow-hidden flex flex-col p-0 shadow-sm rounded-sm gap-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            fill
            priority={false} // Изменено на false для улучшения производительности страницы
            loading="lazy" // Добавлено для отложенной загрузки изображений
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
            alt={`Poster for ${movieTitle}`}
            src={posterUrl}
          />
        </div>
        <CardContent className="p-4 flex flex-col gap-2 h-full">
          <MovieInfo />
          <div className="mt-auto flex flex-col gap-2">
            <Button
              variant={isMovieInFavorites ? "destructive" : "default"}
              onClick={isMovieInFavorites ? handleRemoveMovie : handleAddMovie}
              className="w-full"
            >
              {isMovieInFavorites ? 'Remove from Favorite' : 'Add to Favorite'}
            </Button>
            <MovieDialog
              isOpen={isDialogOpen}
              onOpenChange={handleDialogOpenChange}
              movie={movie}
              movieDetails={movieDetails}
              isLoading={isLoadingDetails}
              onOpenDialog={handleOpenDialog}
            />
          </div>
        </CardContent>
      </Card>
    </li>
  );
};

export default memo(Movie);