'use client';
import React, { JSX, memo, useCallback, useMemo } from 'react';
import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from '@/components/ui';
import { CalendarIcon, ClockIcon, Globe } from 'lucide-react';
import Image from 'next/image';
import { DetailedFilm, Film, FilmPopular } from '@/app/projects/medium/popcorn-movies/features';
import Link from 'next/link';

type MovieDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  movie: Film | FilmPopular;
  movieDetails?: DetailedFilm;
  isLoading: boolean;
  onOpenDialog: () => void;
}

type DetailInfoProps = {
  icon: React.ReactNode;
  text: string;
}

// Выделяем компонент для отображения детальной информации
const DetailInfo = memo(({ icon, text }: DetailInfoProps): JSX.Element => (
  <p className="flex items-center gap-2 text-sm my-1">
    {icon}
    <span>{text}</span>
  </p>
));

DetailInfo.displayName = 'DetailInfo';

const MovieDialog = ({
                       movie,
                       movieDetails,
                       onOpenDialog,
                       isOpen,
                       onOpenChange,
                       isLoading,
                     }: MovieDialogProps): JSX.Element => {

  // Мемоизируем функцию для рендеринга детальной информации
  const renderDetailInfo = useCallback((icon: React.ReactNode, text: string) => (
    <DetailInfo key={text} icon={icon} text={text} />
  ), []);

  // Мемоизируем заголовок фильма
  const movieTitle = useMemo(() =>
      movieDetails?.nameEn || movieDetails?.nameRu || movie.nameEn || movie.nameRu || 'Unknown Title',
    [movieDetails?.nameEn, movieDetails?.nameRu, movie.nameEn, movie.nameRu]);

  // Мемоизируем URL постера
  const posterUrl = useMemo(() =>
      movie.posterUrl || movie.posterUrlPreview || '/placeholder-image.jpg',
    [movie.posterUrl, movie.posterUrlPreview]);

  // Мемоизируем детали фильма для отображения
  const movieDetailItems = useMemo(() => {
    if (!movieDetails) return [];

    const details = [];

    if (movieDetails.filmLength) {
      details.push(renderDetailInfo(
        <ClockIcon className="h-4 w-4" />,
        `Duration: ${movieDetails.filmLength}`,
      ));
    }

    if (movieDetails.year) {
      details.push(renderDetailInfo(
        <CalendarIcon className="h-4 w-4" />,
        `Year: ${movieDetails.year.toString()}`,
      ));
    }

    if (movieDetails.premiereRu) {
      details.push(renderDetailInfo(
        <CalendarIcon className="h-4 w-4" />,
        `Premiere in Russia: ${movieDetails.premiereRu}`,
      ));
    }

    if (movieDetails.premiereWorld) {
      details.push(renderDetailInfo(
        <CalendarIcon className="h-4 w-4" />,
        `World Premiere: ${movieDetails.premiereWorld}`,
      ));
    }

    if (movieDetails.premiereWorldCountry) {
      details.push(renderDetailInfo(
        <Globe className="h-4 w-4" />,
        `Country of premiere: ${movieDetails.premiereWorldCountry}`,
      ));
    }

    return details;
  }, [movieDetails, renderDetailInfo]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={onOpenDialog}>More</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{movieTitle}</DialogTitle>
          <DialogDescription>
            {movieDetails?.slogan && (
              <span className="text-sm italic block mb-2">"{movieDetails.slogan}"</span>
            )}
            {movieDetails?.description && movieDetails.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <Image
              width={150}
              height={225}
              priority={true}
              className="object-cover rounded-md"
              alt={`Poster for ${movieTitle}`}
              src={posterUrl}
            />
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              <div className="space-y-2">
                <Spinner/>
              </div>
            ) : (
              <>
                {movieDetailItems}
                {movieDetails?.type && (
                  <Badge className="max-w-max mt-2">{movieDetails.type}</Badge>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="md:!grid gap-2 grid-cols-2">
          <DialogClose asChild className="w-full">
            <Button className="w-full m-0" type="button" variant="destructive">
              Close
            </Button>
          </DialogClose>
          {movieDetails?.webUrl && (
            <Link
              target="_blank"
              className="w-full !m-0"
              href={movieDetails.webUrl}
              rel="noopener noreferrer"
            >
              <Button className="w-full" disabled={isLoading}>
                Get more information
              </Button>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(MovieDialog);