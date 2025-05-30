'use client';

import { JSX, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/projects/medium/brewery-finder/app';

interface ReduxProviderProps {
  children: ReactNode;
}

export const ReduxProvider = ({ children }: ReduxProviderProps): JSX.Element => (
  <Provider store={store}>{children}</Provider>
);