'use client';

import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { JSX, ReactNode } from 'react';
import Link from 'next/link';
import { Bug, House, LogIn, User2 } from 'lucide-react';
import { ThemeToggle } from '@/components/layout';

interface MenuSection {
  items: MenuItem[];
}

interface MenuItem {
  type: 'item';
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface ProjectHeaderProps {
  title?: string;
  description?: string;
  homeUrl?: string;
  loginUrl?: string;
  userData?: { [key: string]: any };
  menuSections?: MenuSection[];
  children?: ReactNode;
}

export const ProjectHeader = ({
                                title = '',
                                description = '',
                                homeUrl = '',
                                loginUrl = '',
                                userData = {},
                                menuSections = [],
                                children,
                              }: ProjectHeaderProps): JSX.Element => {
  return (
    <header role="banner">
      <Card className="p-0 rounded-none">
        {/* Right Side */}
        <div className="grid place-items-center md:inline-flex items-center gap-2">
          <Link
            href="https://github.com/nagoev-id"
            aria-label="GitHub Profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Bug size={30} aria-hidden="true" />
          </Link>
          <Link
            className="font-semibold"
            href={homeUrl || '/'}
            aria-label={`Return to the main page: ${title}`}
          >
            {title}
          </Link>
        </div>

        {/* Left Side */}
        <ul className="flex gap-2 justify-center items-center" role="list">
          {/* Menu */}
          {userData ? (
            <>
              {/* Menu */}
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
                        {section.items.map((item, itemIndex) => {
                          return (
                            <DropdownMenuItem
                              key={`item-${sectionIndex}-${itemIndex}`}
                              onClick={item.onClick}
                            >
                              {item.href ? (
                                <Link href={item.href}>
                                  <div className="flex items-center gap-2">
                                    {item.label}
                                  </div>
                                </Link>
                              ) : (
                                <div className="flex items-center gap-2">
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
            </>
          ) : (
            // Login Button
            <li>
              <Link href={loginUrl}>
                <Button variant="outline">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            </li>
          )}

          {/* Go To Projects */}
          <li>
            <Link href="/projects">
              <Button variant="outline">
                <House className="h-4 w-4" />
              </Button>
            </Link>
          </li>

          {/* Dark Theme */}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </Card>
    </header>
  );
};