'use client';

import { Card } from '@/components/ui';
import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/chat/redux';
import { ChatList } from '@/app/projects/hard/chat/components';
import { MessageArea } from '@/app/projects/hard/chat/components';
import { supabase } from '@/app/projects/hard/chat/utils';

const HomePage = (): JSX.Element => {
  const { user, isLoading } = useAppSelector(selectAuthData);
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<number | null>(null);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/projects/hard/chat/sign');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  if (!user) return <div className="flex items-center justify-center h-screen">Необходима авторизация</div>;

  return (
    <Card className="p-0 h-[calc(100vh-100px)] flex">
      <ChatList 
        userId={user.id} 
        activeChat={activeChat} 
        onChatSelect={(chatId: number) => setActiveChat(chatId)} 
      />
      <MessageArea 
        userId={user.id} 
        chatId={activeChat} 
      />
    </Card>
  );
};

export default HomePage;
