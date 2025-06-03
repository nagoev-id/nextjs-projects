import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { drinksSliceReducer } from '@/app/projects/medium/cocktail-explorer/features';

export const store = configureStore({
  reducer: {
    drinks: drinksSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: <TSelected>(selector: (state: RootState) => TSelected) => TSelected = useSelector;