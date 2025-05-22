import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { wikiApi } from '@/app/projects/medium/wiki-searcher/features';

export const store = configureStore({
  reducer: {
    [wikiApi.reducerPath]: wikiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wikiApi.middleware),
});

setupListeners(store.dispatch);
