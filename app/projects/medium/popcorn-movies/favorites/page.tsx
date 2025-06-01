'use client';

import { JSX, useCallback } from 'react';
import { useAppSelector } from '@/app/projects/medium/popcorn-movies/app';
import { FavoriteMovie, selectMoviesSliceData } from '@/app/projects/medium/popcorn-movies/features';
import { Movie } from '@/app/projects/medium/popcorn-movies/components';
import { Button, Card } from '@/components/ui';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

const FavoritePage = (): JSX.Element => {
  const { favorites: favoriteMovies } = useAppSelector(selectMoviesSliceData);
  const router = useRouter();
  const handleGoBack = useCallback(() => router.back(), [router]);

  const renderMovie = (movie: FavoriteMovie) => {
    const isFilm = 'filmId' in movie;
    return (
      <Movie
        key={isFilm ? movie.filmId : movie.kinopoiskId}
        movie={movie}
        isPopular={!isFilm}
        isHome={false}
      />
    );
  };

  return (
    <Card className="p-4 rounded-md shadow-md grid gap-2 bg-white dark:bg-gray-800">
      <Button className="inline-flex gap-1 items-center max-w-max" onClick={handleGoBack}>
        <FaArrowLeftLong />
        Go Back
      </Button>

      {favoriteMovies.length === 0 ? (
        <p className="text-center font-semibold">No favorite Movies found.</p>
      ) : (
        <div className="grid gap-3">
          <h1 className="font-semibold text-lg md:text-2xl">Favorite Films / TV-Shows</h1>
          <ul className="grid items-start gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favoriteMovies.map(renderMovie)}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default FavoritePage;