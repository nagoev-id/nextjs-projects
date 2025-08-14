'use client';

'use client';

import { HeaderAbout, HeaderLeft, ThemeToggle } from '@/components/layout';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { Cart } from '@/app/projects/medium/shopping-market-cart/components';
import { PROJECTS_LIST } from '@/shared';
import { memo } from 'react';

/**
 * Интерфейс пропсов для компонента заголовка
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
 */
const MarketHeader = memo(({
                                    title = PROJECTS_LIST.ShoppingMarketCart.title,
                                    description = PROJECTS_LIST.ShoppingMarketCart.description,
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

export default MarketHeader;