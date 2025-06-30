import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { store } from '@/app/projects/medium/age-calculator/redux';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;