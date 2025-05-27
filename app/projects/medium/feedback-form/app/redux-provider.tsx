'use client';

import { JSX, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/projects/medium/feedback-form/app';

/**
 * Интерфейс для пропсов компонента ReduxProvider.
 * @interface ReduxProviderProps
 * @property {ReactNode} children - Дочерние элементы, которые будут обернуты в Provider.
 */
interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Компонент ReduxProvider.
 * Оборачивает дочерние компоненты в Redux Provider, предоставляя им доступ к Redux store.
 *
 * @param {ReduxProviderProps} props - Пропсы компонента.
 * @param {ReactNode} props.children - Дочерние элементы для рендеринга внутри Provider.
 * @returns {JSX.Element} Компонент Provider с переданным store и дочерними элементами.
 */
export const ReduxProvider = ({ children }: ReduxProviderProps): JSX.Element => {
  return <Provider store={store}>{children}</Provider>;
};
