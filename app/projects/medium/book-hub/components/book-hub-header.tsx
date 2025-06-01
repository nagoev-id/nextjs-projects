'use client';

import { JSX, memo } from 'react';
import { ThemeToggle } from '@/components/layout';
import Link from 'next/link';
import { Github } from 'lucide-react';
import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { PROJECTS_LIST } from '@/shared';
import { useAppSelector } from '@/app/projects/medium/book-hub/app';
import { selectBooksSliceData } from '@/app/projects/medium/book-hub/features';

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
 * Мемоизированный компонент для отображения информации о проекте
 *
 * @param {Object} props - Пропсы компонента
 * @param {string} props.title - Заголовок проекта
 * @returns {JSX.Element} Компонент диалога с информацией о проекте
 */
const AboutDialog = memo(({ title }: { title: string }): JSX.Element => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>About</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-lg md:text-2xl">{title}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-lg">
        This project showcases a diverse collection of React applications, demonstrating modern web
        development practices. Each app in this collection is built using React, Redux for state
        management, Tailwind CSS for styling, and Shadcn UI for sleek, customizable components. From
        simple utilities to complex interfaces, this repository serves as both a learning resource and a
        reference for implementing various features in React ecosystems.
      </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));

/**
 * Мемоизированный компонент для отображения левой части заголовка
 *
 * @param {Object} props - Пропсы компонента
 * @param {string} props.title - Заголовок страницы
 * @param {string | null | undefined} props.description - Описание страницы
 * @param {string | undefined} props.ariaLabelLink - ARIA-метка для ссылки
 * @returns {JSX.Element} Компонент левой части заголовка
 */
const HeaderLeft = memo(({
                           title,
                           description,
                           ariaLabelLink,
                         }: {
  title: string;
  description: string | null | undefined;
  ariaLabelLink: string | undefined;
}): JSX.Element => (
  <div className="grid place-items-center md:inline-flex items-center gap-2">
    <Link
      href="https://github.com/nagoev-alim"
      aria-label="GitHub Profile"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Github size={30} aria-hidden="true" />
    </Link>
    <Link
      className="font-semibold"
      href="/"
      aria-label={ariaLabelLink || `Return to the main page: ${title}`}
    >
      {title}
    </Link>
    {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
  </div>
));

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
const BookHubHeader = memo(({
                              title = PROJECTS_LIST.BookHub.title,
                              description = PROJECTS_LIST.BookHub.description,
                              showAbout = false,
                              showBackButton = true,
                              ariaLabelLink,
                            }: HeaderProps = {}): JSX.Element => {
  const { favorites } = useAppSelector(selectBooksSliceData);
  console.log(favorites);
  const favoriteCount = favorites.length;

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
            description={description}
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
                <AboutDialog title={title || ''} />
              </li>
            )}

            {/* Переключатель темы */}
            <li>
              <ThemeToggle />
            </li>

            {favoriteCount > 0 && (
              <li className="flex gap-1.5 items-center">
                <Link href={`/projects/medium/book-hub/favorites/`}>
                  <Button>
                    Favorites ({favoriteCount})
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </Card>
    </header>
  );
});

export default BookHubHeader;