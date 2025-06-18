'use client';

import { JSX, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User, PawPrint, LogOut, LogIn, Menu, X, MessageSquare } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/pets-tinder/redux';
import { useGetUserChatsQuery } from '@/app/projects/hard/pets-tinder/redux/api/chat-api';
import { supabase } from '@/app/projects/hard/pets-tinder/utils';
import { toast } from 'sonner';

const items = [
  {
    title: 'Главная',
    href: '/projects/hard/pets-tinder/page',
    icon: <Home size={18} />,
    isPublic: true,
  },
  {
    title: 'Питомцы',
    href: '/projects/hard/pets-tinder/pages/pets',
    icon: <PawPrint size={18} />,
    isPublic: true,
  },
  {
    title: 'Сообщения',
    href: '/projects/hard/pets-tinder/pages/chat',
    icon: <MessageSquare size={18} />,
    isPublic: false,
  },
  {
    title: 'Профиль',
    href: '/projects/hard/pets-tinder/pages/profile',
    icon: <User size={18} />,
    isPublic: false,
  },
  {
    title: 'Мои питомцы',
    href: '/projects/hard/pets-tinder/pages/profile/pets',
    icon: <PawPrint size={18} />,
    isPublic: false,
  },
];

export const Navbar = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector(selectAuthData);
  const pathname = usePathname();
  const router = useRouter();
  
  // Получаем чаты пользователя для отображения количества непрочитанных сообщений
  const { data: chats } = useGetUserChatsQuery(user?.id || '', { 
    skip: !user?.id,
    pollingInterval: 30000, // Проверяем каждые 30 секунд
  });

  // Считаем количество непрочитанных сообщений
  const unreadMessagesCount = chats?.reduce((count, chat) => {
    return count + chat.messages.filter(m => !m.is_read && m.user_id !== user?.id).length;
  }, 0) || 0;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Вы успешно вышли из системы');
      router.push('/projects/hard/pets-tinder/pages/login');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      toast.error('Ошибка при выходе из системы');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {items
          .filter(item => item.isPublic || user)
          .slice(0, 4) // Показываем только первые 4 пункта меню
          .map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`inline-flex flex-col items-center justify-center px-5 ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.title === 'Сообщения' && unreadMessagesCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]">
                    {unreadMessagesCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.title}</span>
            </Link>
          ))}

        {/* Кнопка "Еще" с выпадающим меню */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="inline-flex flex-col items-center justify-center px-5 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white">
              <Menu size={18} />
              <span className="text-xs mt-1">Еще</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto pb-safe">
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Меню</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </Button>
              </div>
              <div className="grid gap-2">
                {/* Остальные пункты меню, не поместившиеся в нижнюю панель */}
                {items
                  .filter(item => item.isPublic || user)
                  .slice(4)
                  .map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center p-2 rounded-md hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="mr-2">{item.icon}</div>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                
                {/* Кнопка входа/выхода */}
                {user ? (
                  <button
                    className="flex items-center p-2 rounded-md hover:bg-muted text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Выйти</span>
                  </button>
                ) : (
                  <Link
                    href="/projects/hard/pets-tinder/pages/login"
                    className="flex items-center p-2 rounded-md hover:bg-muted text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn size={18} className="mr-2" />
                    <span>Войти</span>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar; 