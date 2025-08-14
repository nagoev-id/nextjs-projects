'use client';

import { JSX, memo } from 'react';
import { HeaderAbout, HeaderLeft, ThemeToggle } from '@/components/layout';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { PROJECTS_LIST } from '@/shared';
import Cart from './cart';

/**
 * Интерфейс пропсов для компонента заголовка
 *
 * @interface HeaderProps
 * @property {string | null | undefined} [title] - Заголовок страницы
 * @property {string | null | undefined} [description] - Краткое описание страницы
 * @property {boolean} [showAbout=false] - Флаг отображения кнопки "О проекте"
 * @property {boolean} [showBackButton=true] - Флаг отображения кнопки возврата на главную
 * @property {string} [ariaLabelLink] - ARIA-метка для ссылки заголовка
 */
type HeaderProps = {
  title?: string | null | undefined;
  description?: string | null | undefined;
  showAbout?: boolean;
  showBackButton?: boolean;
  ariaLabelLink?: string;
}

/**
 * Компонент заголовка магазина
 *
 * @param {HeaderProps} props - Пропсы компонента
 * @param {string | null | undefined} props.title - Заголовок страницы
 * @param {string | null | undefined} props.description - Краткое описание страницы
 * @param {boolean} props.showAbout - Флаг отображения кнопки "О проекте"
 * @param {boolean} props.showBackButton - Флаг отображения кнопки возврата на главную
 * @param {string} props.ariaLabelLink - ARIA-метка для ссылки заголовка
 * @returns {JSX.Element} Компонент заголовка магазина
 */
const MobileStoreHeader = memo(({
                                  title = PROJECTS_LIST.MobileStoreCart.title,
                                  description = PROJECTS_LIST.MobileStoreCart.description,
                                  showAbout = false,
                                  showBackButton = true,
                                  ariaLabelLink,
                                }: HeaderProps = {}) => {
  return (
    <header role="banner">
      <Card className="p-0 rounded-none">
        <nav
          className="grid gap-2.5 md:flex md:justify-between md:items-center p-4 xl:px-0 max-w-6xl w-full mx-auto"
          aria-label="The main navigation"
        >
          {/* Левая часть заголовка: логотип, название и описание */}
          <HeaderLeft
            title={title || ''}
            ariaLabelLink={ariaLabelLink}
          />

          {/* Правая часть заголовка: навигационные элементы */}
          <ul className="flex gap-2 justify-center items-center" role="list">
            {/* Кнопка возврата на главную */}
            {showBackButton && (
              <li>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </li>
            )}

            {/* Модальное окно с информацией о проекте */}
            {showAbout && (
              <li>
                <HeaderAbout title={title || ''} description={description} />
              </li>
            )}

            {/* Переключатель темы */}
            <li>
              <ThemeToggle />
            </li>

            {/* Компонент корзины */}
            <li className="flex gap-1.5 items-center">
              <Cart />
            </li>
          </ul>
        </nav>
      </Card>
    </header>
  );
});

MobileStoreHeader.displayName = 'MobileStoreHeader';

export default MobileStoreHeader;