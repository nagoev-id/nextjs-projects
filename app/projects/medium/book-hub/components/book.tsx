import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/book-hub/app';
import { addFavorite, BookItem, removeFavorite, selectBooksSliceData } from '@/app/projects/medium/book-hub/features';
import { useCallback } from 'react';

type BookProps = {
  book: BookItem;
  isHome?: boolean;
}

const Book = ({ book, isHome = false }: BookProps) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector(selectBooksSliceData);

  const handleAddBook = useCallback(() => {
    dispatch(addFavorite(book));
  }, [dispatch]);

  const handleRemoveBook = useCallback(() => {
    dispatch(removeFavorite(book.id));
  }, [dispatch]);

  const isBookInFavorites = favorites.some((item: BookItem) => item.id === book.id);

  return (
    <li className="dark:bg-accent p-2 border-2 rounded grid gap-2 text-sm min-h-full">
      {isHome
        ? (
          <Link href={`/projects/medium/book-hub/book/${book.id}`}>
            <Image width="100" height="100" priority={true}
                   className="rounded w-full object-cover" src={book.cover_id}
                   alt={book.title} />
          </Link>
        )
        :
        <Image width="100" height="100" priority={true}
               className="rounded w-full object-cover" src={book.cover_id}
               alt={book.title} />
      }
      <div className="grid gap-1.5">
        <h3 className="font-bold">
          {isHome ? <Link href={`/projects/medium/book-hub/book/${book.id}`}>{book.title}</Link> : book.title}
        </h3>
        <p className="flex flex-wrap gap-1">
          <span className="font-bold">Author:</span>
          {book.author && book.author.map((name, idx) => <span key={idx}>{name}</span>)}
        </p>
        <p className="flex flex-wrap gap-1"><span className="font-bold">Total Editions:</span>
          <span>{book.edition_count}</span></p>
        <p className="flex flex-wrap gap-1"><span className="font-bold">First Publish Year:</span>
          <span>{book.first_publish_year}</span></p>
        <Button
          onClick={isBookInFavorites ? handleRemoveBook : handleAddBook}
        >
          {isBookInFavorites ? 'Remove from Favorite' : 'Add to Favorite'}
        </Button>
      </div>
    </li>
  );
};

export default Book;