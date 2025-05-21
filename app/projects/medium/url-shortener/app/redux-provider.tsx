'use client';

/**
 * Redux Provider Component
 * 
 * @module ReduxProvider
 * @description Компонент-обертка для предоставления Redux-хранилища всему дереву компонентов URL Shortener.
 * Использует Provider из react-redux для внедрения хранилища в контекст React.
 */

import { Provider } from 'react-redux';
import { store } from '.';
import { ReactNode } from 'react';

/**
 * Интерфейс для пропсов компонента ReduxProvider
 * 
 * @interface ReduxProviderProps
 * @property {ReactNode} children - Дочерние компоненты, которые будут иметь доступ к Redux-хранилищу
 */
interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Компонент-обертка для предоставления Redux-хранилища
 * 
 * @function ReduxProvider
 * @param {ReduxProviderProps} props - Пропсы компонента
 * @param {ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element} Компонент Provider с внедренным хранилищем
 */
export const ReduxProvider = ({ children }: ReduxProviderProps) => (
  <Provider store={store}>
    {children}
  </Provider>
);