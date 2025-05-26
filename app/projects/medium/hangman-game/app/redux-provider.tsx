'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/projects/medium/hangman-game/app';

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}