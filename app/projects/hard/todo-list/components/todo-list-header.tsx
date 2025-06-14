'use client';

import { JSX, memo } from 'react';
import { HeaderAbout, HeaderLeft, ThemeToggle } from '@/components/layout';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { PROJECTS_LIST } from '@/shared';
import { selectAuthSliceData, useAppSelector, useSignOutMutation } from '@/app/projects/hard/todo-list/redux';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
export const TodoListHeader = memo(({
                                      title = PROJECTS_LIST.TodoList_H.title,
                                      description = PROJECTS_LIST.TodoList_H.description,
                                      showAbout = false,
                                      showBackButton = true,
                                      ariaLabelLink,
                                    }: HeaderProps = {}): JSX.Element => {
  const { user } = useAppSelector(selectAuthSliceData);
  const router = useRouter();
  const [signOut] = useSignOutMutation();

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      router.push('/projects/hard/todo-list');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

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
            description={''}
            ariaLabelLink={ariaLabelLink}
          />

          {/* Правая часть заголовка: навигационные элементы */}
          <ul className="flex gap-2 justify-center items-center" role="list">
            {/* Кнопка возврата на главную */}
            {showBackButton && (
              <li>
                <Link href="/projects">
                  <Button variant="outline">Back</Button>
                </Link>
              </li>
            )}

            {/* Модальное окно с информацией о проекте */}
            <li>
              <HeaderAbout title={title || ''} description={description} />
            </li>

            {/* Кнопка выхода из системы */}
            {user && (
              <li>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </li>
            )}
            {/* Переключатель темы */}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </Card>
    </header>
  );
});