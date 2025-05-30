import { Button } from '@/components/ui/button';
import { JSX, memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/hacker-news-search/app';
import {
  handlePage,
  selectHackerNewsData,
  setNews,
  useLazyGetQuery,
} from '@/app/projects/medium/hacker-news-search/features';
import { toast } from 'sonner';

/**
 * @typedef {1 | -1} PageDirection
 * @description Направление изменения страницы: 1 - вперед, -1 - назад
 */
type PageDirection = 1 | -1;

/**
 * @component Controls
 * @description Компонент управления пагинацией для результатов поиска Hacker News
 * @returns {JSX.Element} Элемент с кнопками навигации и информацией о текущей странице
 */
const Controls = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { page, nbPages, query } = useAppSelector(selectHackerNewsData);
  const [fetchNews] = useLazyGetQuery();

  /**
   * @function handlePageChange
   * @description Обрабатывает изменение страницы и загружает новые данные
   * @param {PageDirection} direction - Направление изменения страницы (1: вперед, -1: назад)
   */
  const handlePageChange = useCallback(async (direction: PageDirection) => {
    const newPage = direction === 1 ? page + 1 : page - 1;
    if (newPage >= 0 && newPage < nbPages) {
      dispatch(handlePage(direction === 1 ? 'increase' : 'decrease'));
      try {
        const result = await fetchNews({ query, page: newPage }).unwrap();
        dispatch(setNews(result));
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to fetch more news', { richColors: true });
      }
    }
  }, [dispatch, fetchNews, nbPages, page, query]);

  // Предварительно вычисляем состояния кнопок
  const isPrevDisabled = page === 0;
  const isNextDisabled = page === nbPages - 1;

  return (
    <div className="flex gap-2 justify-center items-center">
      <Button 
        onClick={() => handlePageChange(-1)} 
        disabled={isPrevDisabled}
        aria-label="Previous page"
      >
        Previous
      </Button>
      <p aria-live="polite" aria-atomic="true">
        <span className="font-bold">{page + 1}</span> of <span className="font-bold">{nbPages}</span>
      </p>
      <Button 
        onClick={() => handlePageChange(1)} 
        disabled={isNextDisabled}
        aria-label="Next page"
      >
        Next
      </Button>
    </div>
  );
};

// Мемоизируем компонент для предотвращения лишних перерендеров
export default memo(Controls);