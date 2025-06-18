'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/chat/redux';

export const Header = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="bg-white border-b mb-6">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/projects/hard/chat" className="text-xl font-bold">
          Чат-приложение
        </Link>
        
        {user && (
          <nav className="flex gap-6">
            <Link 
              href="/projects/hard/chat"
              className={`${isActive('/projects/hard/chat') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Чаты
            </Link>
            <Link 
              href="/projects/hard/chat/profile"
              className={`${isActive('/projects/hard/chat/profile') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Профиль
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}; 