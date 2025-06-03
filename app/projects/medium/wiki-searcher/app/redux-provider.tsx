'use client';

import { JSX, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/projects/medium/wiki-searcher/app/store';

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider = ({ children }: ReduxProviderProps): JSX.Element => (
  <Provider store={store}>{children}</Provider>
);

export default ReduxProvider;