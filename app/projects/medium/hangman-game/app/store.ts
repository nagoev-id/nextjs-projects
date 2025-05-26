import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { hangmanSlice } from '@/app/projects/medium/hangman-game/features';

export const store = configureStore({
  reducer: {
    hangman: hangmanSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: <TSelected>(selector: (state: RootState) => TSelected) => TSelected = useSelector;