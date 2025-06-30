'use client';

import { JSX, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/projects/medium/age-calculator/redux';

/**
 * Интерфейс для пропсов компонента ReduxProvider.
 * @interface
 */
interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Компонент-обертка для предоставления Redux store дочерним компонентам.
 *
 * @param {Object} props - Пропсы компонента.
 * @param {ReactNode} props.children - Дочерние элементы, которые будут обернуты в Provider.
 * @returns {JSX.Element} Компонент Provider из react-redux, обернутый вокруг дочерних элементов.
 */
export const ReduxProvider = ({ children }: ReduxProviderProps): JSX.Element => (
  <Provider store={store}>{children}</Provider>
);