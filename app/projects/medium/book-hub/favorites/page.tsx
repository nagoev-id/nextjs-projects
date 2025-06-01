'use client';

import { JSX, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/book-hub/app';
import { BookItem, clearFavorites, selectBooksSliceData } from '@/app/projects/medium/book-hub/features';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { FaArrowLeftLong, FaTrash } from 'react-icons/fa6';
import { Book } from '@/app/projects/medium/book-hub/components';
import { toast } from 'sonner';

/**
 * @component FavoritePage
 * @description Страница для отображения избранных книг пользователя
 * @returns {JSX.Element} Компонент страницы избранных книг
 */
const FavoritePage = (): JSX.Element => {
  const { favorites } = useAppSelector(selectBooksSliceData);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Мемоизируем обработчики для предотвращения ненужных ререндеров
  const handleGoBack = useCallback((): void => router.back(), [router]);
  
  const handleClearFavorites = useCallback((): void => {
    if (window.confirm('You are sure you want to delete all selected books?')) {
      dispatch(clearFavorites());
      toast.success('All selected books are deleted');
    }
  }, [dispatch]);
  
  // Мемоизируем разбивку книг на категории для оптимизации производительности
  const booksByYear = useMemo(() => {
    if (favorites.length === 0) return {};
    
    return favorites.reduce<Record<string, BookItem[]>>((acc, book) => {
      const year = book.first_publish_year || 'Unknown year';
      if (!acc[year]) acc[year] = [];
      acc[year].push(book);
      return acc;
    }, {});
  }, [favorites]);
  
  // Мемоизируем сортировку годов для стабильного порядка отображения
  const sortedYears = useMemo(() => {
    return Object.keys(booksByYear).sort((a, b) => {
      // Сначала сортируем числовые годы
      if (!isNaN(Number(a)) && !isNaN(Number(b))) {
        return Number(b) - Number(a); // От новых к старым
      }
      // "Неизвестный год" всегда в конце
      if (a === 'Unknown year') return 1;
      if (b === 'Unknown year') return -1;
      return a.localeCompare(b);
    });
  }, [booksByYear]);

  return (
    <Card className="p-4 rounded-md shadow-md grid gap-4 ">
      <div className="flex justify-between items-center">
        <Button 
          className="inline-flex gap-1 items-center" 
          onClick={handleGoBack}
          aria-label="Return back"
        >
          <FaArrowLeftLong />
          Back
        </Button>
        
        {favorites.length > 0 && (
          <Button 
            variant="destructive" 
            className="inline-flex gap-1 items-center" 
            onClick={handleClearFavorites}
            aria-label="Clean all selected books"
          >
            <FaTrash />
            Clean everything
          </Button>
        )}
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-10">
          <p className="font-semibold text-lg mb-4">Not found selected books</p>
          <Button onClick={() => router.push('/projects/medium/book-hub')}>
            Find books
          </Button>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid gap-6">
          <h1 className="font-semibold text-lg md:text-2xl">
            Selected books <span className="text-sm font-normal">({favorites.length})</span>
          </h1>
          
          {sortedYears.map(year => (
            <section key={year} className="grid gap-3">
              <h2 className="font-medium text-md border-b pb-1">
                {year} {year !== 'Неизвестный год' && 'год'} 
                <span className="text-sm font-normal ml-2">({booksByYear[year].length})</span>
              </h2>
              <ul className="grid items-start gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {booksByYear[year].map((book: BookItem) => (
                  <Book key={book.id} book={book} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Card>
  );
};

export default FavoritePage;