'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/projects/medium/jobs-filter/app/store';

interface ReduxProviderProps {
  children: ReactNode;
}

export const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};
