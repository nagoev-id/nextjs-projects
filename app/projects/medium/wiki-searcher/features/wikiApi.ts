import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type WikiSearchResult = {
  pageid: number;
  title: string;
  snippet: string;
  size: number;
  wordcount: number;
  timestamp: string;
  score?: number;
  ns: number;
}

export const wikiApi = createApi({
  reducerPath: 'wikiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://en.wikipedia.org/w/api.php',
  }),
  endpoints: (builder) => ({
    searchWiki: builder.query<WikiSearchResult[], string>({
      query: (searchTerm: string) => ({
        url: '',
        params: {
          action: 'query',
          list: 'search',
          srlimit: 20,
          format: 'json',
          origin: '*',
          srsearch: searchTerm,
        },
      }),
      transformResponse: (response: any) => response.query.search,
    }),
  }),
});

export const { useLazySearchWikiQuery } = wikiApi;
