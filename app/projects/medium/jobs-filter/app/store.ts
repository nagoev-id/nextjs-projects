import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {useDispatch, useSelector} from 'react-redux';
import {filtersSlice, positionsSlice} from "@/app/projects/medium/jobs-filter/features";


export const store = configureStore({
  reducer: {
    filters: filtersSlice.reducer,
    positions: positionsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
});

setupListeners(store.dispatch);

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: <TSelected>(selector: (state: RootState) => TSelected) => TSelected = useSelector;