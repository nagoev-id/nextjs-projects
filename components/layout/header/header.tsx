'use client';

import { ThemeToggle } from '@/components/layout';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

/**
 * @typedef {Object} HeaderProps
 * @property {string} [title='Collections of React Apps'] - Заголовок шапки
 * @property {string} [description] - Описание под заголовком
 * @property {boolean} [showAbout=false] - Флаг для отображения кнопки "About"
 * @property {boolean} [showBackButton=true] - Флаг для отображения кнопки "Back to Home"
 * @property {string} [ariaLabelLink] - ARIA-метка для ссылки на главную страницу
 */
type HeaderProps = {
  title?: string | null | undefined;
  description?: string | null | undefined;
  showAbout?: boolean;
  showBackButton?: boolean;
  ariaLabelLink?: string;
}

/**
 * Компонент шапки сайта
 *
 * @type {React.FC<HeaderProps>}
 * @param {HeaderProps} props - Пропсы компонента
 * @returns {JSX.Element} Отрендеренный компонент шапки
 *
 * @description
 * Этот компонент использует компоненты из библиотеки Shadcn UI для создания
 * адаптивной шапки сайта с навигацией, переключателем темы и модальным окном "About".
 */
const Header = ({
                  title = 'Collections of React Apps',
                  description,
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
          <ul className="flex gap-2 justify-center items-center" role="list">
            {showBackButton && (
              <li>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </li>
            )}
            {showAbout && (
              <li>
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

export default Header;