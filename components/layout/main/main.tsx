'use client';
import { JSX, ReactNode } from 'react';

/**
 * @interface MainProps
 * @description Интерфейс для пропсов компонента Main
 * @property {ReactNode} children - Дочерние элементы, которые будут отображены внутри компонента
 * @property {string} [className] - Дополнительные CSS классы для компонента
 */
interface MainProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  style?: {
    height: string;
  };
}

/**
 * Компонент Main - основной контейнер для содержимого страницы
 *
 * @param {Object} props - Пропсы компонента
 * @param {ReactNode} props.children - Дочерние элементы для отображения
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Отрендеренный компонент Main
 *
 * @description
 * Этот компонент создает основной контейнер для содержимого страницы.
 * Он использует классы Tailwind CSS для стилизации и обеспечивает
 * отзывчивый макет с максимальной шириной и центрированием содержимого.
 */
export const Main = ({ children, className = '', containerClassName = '' }: MainProps): JSX.Element => (
  <main className={`flex flex-col h-screen p-4 xl:px-0 ${className}`}>
    <div className={`max-w-6xl w-full mx-auto flex-grow ${containerClassName}`}>
      {children}
    </div>
  </main>
);