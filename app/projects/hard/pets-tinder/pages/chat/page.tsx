'use client';

import { JSX, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { useGetUserChatsQuery } from '@/app/projects/hard/pets-tinder/redux/api/chat-api';
import { useGetAnimalByIdQuery } from '@/app/projects/hard/pets-tinder/redux/api/animals-api';
import { useGetUserByIdQuery } from '@/app/projects/hard/pets-tinder/redux/api/users-api';
import { LoadingCard, ErrorCard } from '@/app/projects/hard/pets-tinder/components/ui';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/pets-tinder/redux';

// Компонент для отображения информации о питомце
const AnimalInfo = ({ animalId }: { animalId: number }) => {
  const { data: animal, isLoading } = useGetAnimalByIdQuery(animalId);
  
  if (isLoading) return <div className="text-sm text-muted-foreground">Загрузка информации о питомце...</div>;
  if (!animal) return <div className="text-sm text-muted-foreground">Информация о питомце недоступна</div>;
  
  return (
    <div className="text-sm">
      <p className="font-medium">{animal.name}</p>
      <p className="text-muted-foreground">
        {animal.view === 'd' ? 'Собака' : 'Кошка'} - {animal.breed}
      </p>
    </div>
  );
};

// Компонент для отображения информации о пользователе
const UserInfo = ({ userId, currentUserId }: { userId: string, currentUserId: string }) => {
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  
  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return <div>Пользователь не найден</div>;
  
  const isCurrentUser = userId === currentUserId;
  
  return (
    <div className="text-sm">
      <p className="font-medium">
        {isCurrentUser ? 'Вы' : user.full_name || user.username}
        {isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">Вы</Badge>}
      </p>
    </div>
  );
};

const ChatsPage = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const router = useRouter();
  const { data: chats, isLoading, error } = useGetUserChatsQuery(user?.id || '', { 
    skip: !user?.id,
    pollingInterval: 10000, // Обновляем каждые 10 секунд
  });

  // Перенаправляем неавторизованных пользователей
  useEffect(() => {
    // Удаляем автоматическое перенаправление, чтобы показать пользователю кнопку входа
  }, [user, router]);

  if (!user) {
    return (
      <Card className="p-4">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-4">Для доступа к чатам необходимо авторизоваться</p>
          <Link href="/projects/hard/pets-tinder/pages/login">
            <Button>
              Войти или зарегистрироваться
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingCard message="Загрузка чатов..." />;
  }

  if (error) {
    return <ErrorCard message="Не удалось загрузить чаты" />;
  }

  if (!chats || chats.length === 0) {
    return (
      <Card className="p-4">
        <CardHeader className="p-0">
          <CardTitle>Сообщения</CardTitle>
          <CardDescription>У вас пока нет активных чатов</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-4">
            Начните общение с владельцами питомцев, чтобы здесь появились ваши чаты
          </p>
          <Link href="/projects/hard/pets-tinder/pages/pets">
            <Button>
              Перейти к каталогу питомцев
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Определяем второго участника чата (не текущего пользователя)
  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p.user_id !== user.id)?.user_id;
  };

  // Получаем последнее сообщение чата
  const getLastMessage = (chat) => {
    if (chat.messages.length === 0) return null;
    return chat.messages[chat.messages.length - 1];
  };

  // Форматируем дату последнего сообщения
  const formatLastMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  // Считаем непрочитанные сообщения
  const countUnreadMessages = (chat) => {
    return chat.messages.filter(m => !m.is_read && m.user_id !== user.id).length;
  };

  return (
    <Card className="p-4 gap-4">
      <CardHeader className="p-0">
        <CardTitle>Сообщения</CardTitle>
        <CardDescription>Ваши активные чаты</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 pt-4">
        <div className="grid gap-4">
          {chats.map(chat => {
            const otherParticipantId = getOtherParticipant(chat);
            const lastMessage = getLastMessage(chat);
            const unreadCount = countUnreadMessages(chat);
            
            return (
              <Link key={chat.id} href={`/projects/hard/pets-tinder/pages/chat/${chat.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between gap-4">
                    <div className="flex flex-col flex-grow overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        {otherParticipantId && (
                          <UserInfo userId={otherParticipantId} currentUserId={user.id} />
                        )}
                      </div>
                      
                      <AnimalInfo animalId={chat.animals_id} />
                      
                      {lastMessage ? (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground truncate">
                          <span className="truncate">
                            {lastMessage.user_id === user.id ? 'Вы: ' : ''}
                            {lastMessage.text}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Нет сообщений
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end justify-between">
                      {lastMessage && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatLastMessageTime(lastMessage.sent_at)}
                        </div>
                      )}
                      
                      {unreadCount > 0 && (
                        <Badge className="mt-1 bg-primary">{unreadCount}</Badge>
                      )}
                      
                      <Button variant="ghost" size="sm" className="mt-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatsPage;