import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { dobReducer } from '@/app/projects/medium/age-calculator/redux';

export const store = configureStore({
  reducer: {
    dobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});


setupListeners(store.dispatch);

