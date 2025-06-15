'use client';

import { JSX, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { GalleryHorizontal, LogOut, Upload, User2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { HiPhoto } from 'react-icons/hi2';
import { HeaderLeft, ThemeToggle } from '@/components/layout';
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
import { PROJECTS_LIST } from '@/shared';
import { selectAuthData, useAppSelector, useSignOutMutation } from '@/app/projects/hard/photo-gallery/redux';

type HeaderProps = {
  title?: string | null | undefined;
  description?: string | null | undefined;
}

type MenuItem = {
  type: 'item' | 'label' | 'separator';
  label?: string;
  href?: string;
  icon?: JSX.Element;
  onClick?: () => void;
}

type MenuSection = {
  label?: string;
  items: MenuItem[];
}

const DEFAULT_DATA = {
  title: PROJECTS_LIST.PhotoGallery_0.title || '',
  description: PROJECTS_LIST.PhotoGallery_0.description,
};

const PhotoGalleryHeader = (): JSX.Element => {
  const [state] = useState<HeaderProps>(DEFAULT_DATA);
  const { user } = useAppSelector(selectAuthData);
  const [signOut] = useSignOutMutation();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut().unwrap();
      router.push('/projects/hard/photo-gallery');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  }, [signOut, router]);

  const menuSections: MenuSection[] = useMemo(() => [
    {
      label: 'Menu',
      items: [
        {
          type: 'item',
          label: 'Discover',
          href: '/projects/hard/photo-gallery',
          icon: <GalleryHorizontal className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'My Photos',
          href: '/projects/hard/photo-gallery/photos',
          icon: <HiPhoto className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Upload Photo',
          href: '/projects/hard/photo-gallery/photos/new',
          icon: <Upload className="h-4 w-4" />,
        },
      ],
    },
    {
      label: 'My Account',
      items: [
        {
          type: 'item',
          label: 'Profile',
          href: '/projects/hard/photo-gallery/profile',
          icon: <User2 className="h-4 w-4" />,
        },
        {
          type: 'item',
          label: 'Sign Out',
          onClick: handleSignOut,
          icon: <LogOut className="h-4 w-4" />,
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
            title={state.title}
            description={state.description}
          />

          <ul className="flex gap-2 justify-center items-center" role="list">
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
                      <div key={`section-${sectionIndex}`}>
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
                <Link href="/projects/hard/photo-gallery/sign">
                  <Button variant="outline">Login</Button>
                </Link>
              </li>
            )}
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </Card>
    </header>
  );
};

export default PhotoGalleryHeader;