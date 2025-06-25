'use client';

import Link from 'next/link';
import { Ellipsis, ExternalLink, Tally1, Tally2, Tally3 } from 'lucide-react';
import { JSX, useMemo } from 'react';
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { HeaderAbout, HeaderLeft, ThemeToggle } from '@/components/layout';


type MenuItem = {
  type: 'item' | 'label' | 'separator';
  label?: string;
  href?: string;
  icon?: JSX.Element;
  onClick?: () => void;
}


type MenuSection = {
  label?: {
    isLink?: boolean;
    text: string;
    href?: string | null | undefined;
  },
  items: MenuItem[];
}

/*
  * @typedef {Object} HeaderProps
  * @property {string|null|undefined} [title] - Заголовок шапки сайта
  * @property {string|null|undefined} [description] - Описание шапки сайта
  * @property {boolean} [showAbout] - Флаг для отображения секции "About"
  * @property {string} [ariaLabelLink] - ARIA метка для ссылки в шапке
 */
type HeaderProps = {
  title?: string | null | undefined;
  description?: string | null | undefined;
  showAbout?: boolean;
  ariaLabelLink?: string;
}

/**
 * Компонент шапки сайта
 *
 * @param {HeaderProps} props - Пропсы компонента
 * @returns {JSX.Element} Отрендеренный компонент шапки
 *
 * @description
 * Этот компонент использует компоненты из библиотеки Shadcn UI для создания
 * адаптивной шапки сайта с навигацией, переключателем темы и модальным окном "About".
 */
export const Header = ({
                  title = 'Collections of React Apps',
                  showAbout,
                  description,
                  ariaLabelLink,
                }: HeaderProps = {}): JSX.Element => {

  const menuSections: MenuSection[] = useMemo(() => [
    {
      label: {
        isLink: true,
        text: 'Home',
        href: '/',
      },
      items: [],
    },
    {
      label: {
        isLink: true,
        text: 'Projects',
        href: '/projects',
      },
      items: [
        {
          type: 'item',
          label: 'Easy Projects',
          href: '/projects/easy',
          icon: <Tally1 className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Medium Projects',
          href: '/projects/medium',
          icon: <Tally2 className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Hard Projects',
          href: '/projects/hard',
          icon: <Tally3 className="h-4 w-4" />,
        },
      ],
    },
  ], []);

  return (
    <header role="banner">
      <Card className="p-0 rounded-none">
        <nav
          className="grid gap-2.5 md:flex md:justify-between md:items-center p-4 xl:px-0 max-w-6xl w-full mx-auto"
          aria-label="The main navigation"
        >
          <HeaderLeft
            title={title || ''}
            ariaLabelLink={ariaLabelLink}
          />
          <ul className="flex gap-2 justify-center items-center" role="list">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild={true}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {menuSections.map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`}>
                      {section.label && (
                        <>
                          <DropdownMenuLabel>
                            {section.label.isLink && section.label.href ? (
                              <Link href={section.label.href} className="flex items-center gap-1.5">
                                <ExternalLink className="h-4 w-4" />
                                {section.label.text}
                              </Link>
                            ) : (
                              <span>{section.label.text}</span>
                            )}
                          </DropdownMenuLabel>
                        </>
                      )}

                      {section.items.map((item, itemIndex) => {
                        if (item.type === 'separator') {
                          return <DropdownMenuSeparator key={`item-${sectionIndex}-${itemIndex}`} />;
                        }

                        if (item.type === 'label') {
                          return <DropdownMenuLabel
                            key={`item-${sectionIndex}-${itemIndex}`}>{item.label}</DropdownMenuLabel>;
                        }

                        return (
                          <DropdownMenuItem
                            key={`item-${sectionIndex}-${itemIndex}`}
                            onClick={item.onClick}
                          >
                            {item.href ? (
                              <Link href={item.href}>
                                <div className="flex items-center gap-2">
                                  {item.icon}
                                  {item.label}
                                </div>
                              </Link>
                            ) : (
                              <div className="flex items-center gap-2">
                                {item.icon}
                                {item.label}
                              </div>
                            )}
                          </DropdownMenuItem>
                        );
                      })}

                      {sectionIndex < menuSections.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {showAbout && (
              <li>
                <HeaderAbout title={title} description={description} />
              </li>
            )}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </Card>
    </header>
  );
};