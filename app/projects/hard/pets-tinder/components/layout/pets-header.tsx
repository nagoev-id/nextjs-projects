'use client';

import { JSX, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { GalleryHorizontal, Github, LogOut, MessageSquare, User2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HiPhoto } from 'react-icons/hi2';
import { ThemeToggle } from '@/components/layout';
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
import { MenuSection, PetsHeaderProps } from '@/app/projects/hard/pets-tinder/utils';
import { selectAuthData, useAppSelector, useSignOutMutation } from '@/app/projects/hard/pets-tinder/redux';

export const PetsHeader = ({ title = '', description = '' }: PetsHeaderProps): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const [signOut] = useSignOutMutation();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut().unwrap();
      router.push('/projects/hard/pets-tinder');
    } catch (error) {
      console.error('Ошибка выхода:', error);
      toast.error('Не удалось выйти');
    }
  }, [signOut, router]);

  const menuSections: MenuSection[] = useMemo(() => [
    {
      label: 'Меню',
      items: [
        {
          type: 'item',
          label: 'Обзор',
          href: '/projects/hard/pets-tinder',
          icon: <GalleryHorizontal className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Питомцы',
          href: '/projects/hard/pets-tinder/pages/pets',
          icon: <HiPhoto className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Сообщения',
          href: '/projects/hard/pets-tinder/pages/chat',
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Мои питомцы',
          href: '/projects/hard/pets-tinder/pages/profile/pets',
          icon: <HiPhoto className="h-4 w-4" />,
        },
      ],
    },
    {
      label: 'Мой аккаунт',
      items: [
        {
          type: 'item',
          label: 'Профиль',
          href: '/projects/hard/pets-tinder/pages/profile',
          icon: <User2 className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Выйти',
          onClick: handleSignOut,
          icon: <LogOut className="h-4 w-4" />,
        },
      ],
    },
  ], []);

  return (
    <header role="баннер">
      <Card className="p-0 rounded-none">
        <nav
          className="grid gap-2.5 md:flex md:justify-between md:items-center p-4 xl:px-0 max-w-6xl w-full mx-auto"
          aria-label="Главная навигация"
        >
          <div className="grid place-items-center md:inline-flex items-center gap-2">
            <Link
              href="https://github.com/nagoev-id"
              aria-label="GitHub Profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={30} aria-hidden="true" />
            </Link>
            <Link
              className="font-semibold"
              href="/projects/hard/pets-tinder"
              aria-label={`Return to the main page: ${title}`}
            >
              {title}
            </Link>
          </div>

          <ul className="flex gap-2 justify-center items-center" role="список">
            {user ? (
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild={true}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {menuSections.map((section, sectionIndex) => (
                      <div key={`раздел-${sectionIndex}`}>
                        {section.label && (
                          <>
                            <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
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
            ) : (
              <li>
                <Link href="/projects/hard/pets-tinder/pages/login">
                  <Button variant="outline">Войти</Button>
                </Link>
              </li>
            )}
            {/*<li>*/}
            {/*  <Link href="/projects">*/}
            {/*    <Button variant="outline">*/}
            {/*      <House className="h-4 w-4" />*/}
            {/*    </Button>*/}
            {/*  </Link>*/}
            {/*</li>*/}
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </Card>
    </header>
  );
};