'use client';
import { ReactNode } from 'react';

/**
 * @interface MainProps
 * @description Интерфейс для пропсов компонента Main
 * @property {ReactNode} children - Дочерние элементы, которые будут отображены внутри компонента
 * @property {string} [className] - Дополнительные CSS классы для компонента
 */
interface MainProps {
  children: ReactNode;
  className?: string;
}

/**
 * Компонент Main - основной контейнер для содержимого страницы
 * 
 * @type {React.FC<MainProps>}
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
const Main: React.FC<MainProps> = ({ children, className = '' }) => (
  <main className={`flex-grow flex flex-col p-4 xl:px-0 max-w-6xl w-full mx-auto ${className}`}>
    {children}
  </main>
);

export default Main;