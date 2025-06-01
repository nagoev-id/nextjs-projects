'use client';

import { useParams, useRouter } from 'next/navigation';
import { JSX, useCallback, useMemo } from 'react';
import {
  addFavorite,
  BookItem,
  removeFavorite,
  selectIsFavorite,
  useGetByIdQuery,
} from '@/app/projects/medium/book-hub/features';
import { Badge, Button, Card, Spinner } from '@/components/ui';
import { FaArrowLeftLong, FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/book-hub/app';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * @component BookPage
 * @description Страница детальной информации о книге
 * @returns {JSX.Element} Компонент страницы книги
 */
const BookPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: book, isLoading, isError, isSuccess } = useGetByIdQuery(id as string);
  const isFavorite = useAppSelector(selectIsFavorite(id as string));

  // Мемоизированные обработчики для предотвращения ненужных ререндеров
  const handleGoBack = useCallback((): void => router.back(), [router]);

  const handleToggleFavorite = useCallback((): void => {
    if (!book) return;

    if (isFavorite) {
      dispatch(removeFavorite(book.id));
      toast.success('The book is removed from the chosen one');
    } else {
      // Convert BookDetails to BookItem
      const bookItem: BookItem = {
        id: book.id,
        title: book.title,
        author: book.authors?.map(a => a.name) || [],
        cover_id: book.coverImg,
        edition_count: book.edition_count || 0,
        first_publish_year: book.first_publish_year || 0
      };
      dispatch(addFavorite(bookItem));
      toast.success('The book added to favorites');
    }
  }, [book, dispatch, isFavorite]);

  // Мемоизированные данные для отображения
  const bookDetails = useMemo(() => {
    if (!book) return null;

    return [
      { label: 'Author', value: book.authors?.map(a => a.name).join(', '), visible: !!book.authors?.length },
      { label: 'Year of publication', value: book.first_publish_year, visible: !!book.first_publish_year },
      { label: 'Publisher', value: book.publisher, visible: !!book.publisher },
      { label: 'ISBN', value: book.isbn, visible: !!book.isbn },
    ].filter(item => item.visible);
  }, [book]);

  return (
    <Card className="p-4 rounded-sm gap-4">
      <div className="flex justify-between items-center">
        <Button
          className="inline-flex gap-1 items-center"
          onClick={handleGoBack}
          aria-label="Return back"
        >
          <FaArrowLeftLong />
          Back
        </Button>

        {isSuccess && book && (
          <Button
            variant={isFavorite ? "outline" : "default"}
            className="inline-flex gap-1 items-center"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remove from the chosen one" : "Add to favorites"}
          >
            {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
            {isFavorite ? "In the chosen one" : "To the favorites"}
          </Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Spinner className="w-10 h-10" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">There was an error when downloading information about the book</p>
          <Button onClick={handleGoBack}>Return back</Button>
        </div>
      )}

      {/* Success */}
      {isSuccess && book && (
        <div className="grid gap-6">
          <h1 className="text-2xl font-bold">{book.title}</h1>

          <div className="grid md:grid-cols-[300px_1fr] gap-4 md:gap-6">
            {/* Изображение книги */}
            <div className="flex flex-col gap-4">
              <Image
                width={300}
                height={450}
                className="w-full max-w-[300px] rounded shadow-md object-cover"
                src={book.coverImg}
                alt={`Book cover "${book.title}"`}
                priority
              />

              {/* Основная информация о книге */}
              {bookDetails && bookDetails.length > 0 && (
                <div className="bg-muted/30 p-3 rounded">
                  <ul className="grid gap-2 text-sm">
                    {bookDetails.map((detail, idx) => (
                      <li key={idx} className="grid grid-cols-[100px_1fr]">
                        <span className="font-medium">{detail.label}:</span>
                        <span>{detail.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ссылка на избранное */}
              <Link
                href="/projects/medium/book-hub/favorites"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <FaBookmark size={12} />
                Go to selected books
              </Link>
            </div>

            {/* Детальная информация */}
            <div className="grid gap-6">
              {/* Описание */}
              {book.description && (
                <section className="grid gap-2">
                  <Badge variant="outline" className="font-bold max-w-max">Description</Badge>
                  <div className="text-sm leading-relaxed">
                    {book.description}
                  </div>
                </section>
              )}

              {/* Места */}
              {book.subject_places && book.subject_places.length > 0 && (
                <section className="grid gap-2">
                  <Badge variant="outline" className="font-bold max-w-max">Places of action</Badge>
                  <ul className="list-disc list-inside text-sm">
                    {book.subject_places.map((place, idx) => (
                      <li key={idx}>{place}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Временные периоды */}
              {book.subject_times && (
                <section className="grid gap-2">
                  <Badge variant="outline" className="font-bold max-w-max">Time periods</Badge>
                  <div className="text-sm">
                    {Array.isArray(book.subject_times)
                      ? book.subject_times.join(', ')
                      : book.subject_times
                    }
                  </div>
                </section>
              )}

              {/* Темы */}
              {book.subjects && (
                <section className="grid gap-2">
                  <Badge variant="outline" className="font-bold max-w-max">Topic</Badge>
                  {Array.isArray(book.subjects) && book.subjects.length > 0
                    ? (
                      <ul className="list-disc list-inside text-sm grid grid-cols-1 md:grid-cols-2 gap-1">
                        {book.subjects.map((subject, idx) => (
                          <li key={idx}>{subject}</li>
                        ))}
                      </ul>
                    )
                    : <div className="text-sm">{book.subjects}</div>
                  }
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BookPage;