import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { api, sliceReducer } from '@/app/projects/medium/_template-redux-base/features';


export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    slice: sliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: <TSelected>(selector: (state: RootState) => TSelected) => TSelected = useSelector;