import { useCallback, useState } from 'react';
import { useAppDispatch } from '../app';
import {
  clearSearchResults,
  resetPage,
  setSearchQuery,
  setSearchResults,
  useLazyGetByKeywordQuery,
} from '../features';
import { toast } from 'sonner';
import { FormSchema } from '../utils';

const useMovieSearch = (formCollection: any) => {
  const [searchByQuery] = useLazyGetByKeywordQuery();
  const dispatch = useAppDispatch();
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const onSearchSubmit = useCallback(async ({ query: keyword }: FormSchema) => {
    try {
      dispatch(clearSearchResults());
      dispatch(resetPage());
      setCurrentKeyword(keyword);
      dispatch(setSearchQuery(keyword));
      const result = await searchByQuery({ keyword, page: 1 }).unwrap();
      dispatch(setSearchResults({
        films: result.films,
        isNewSearch: true,
      }));
      setHasMore(result.films.length > 0);
      formCollection.reset();
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error when searching for movies', { richColors: true });
    }
  }, [searchByQuery, dispatch, formCollection]);

  return {
    onSearchSubmit,
    currentKeyword,
    hasMore,
  };
};

export default useMovieSearch;