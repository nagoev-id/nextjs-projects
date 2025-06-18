'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, User } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Badge,
} from '@/components/ui';
import { 
  useGetChatByIdQuery, 
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  Message,
  ChatWithParticipantsAndMessages
} from '@/app/projects/hard/pets-tinder/redux/api/chat-api';
import { useGetAnimalByIdQuery } from '@/app/projects/hard/pets-tinder/redux/api/animals-api';
import { useGetUserByIdQuery } from '@/app/projects/hard/pets-tinder/redux/api/users-api';
import { LoadingCard, ErrorCard } from '@/app/projects/hard/pets-tinder/components/ui';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/pets-tinder/redux';
import Link from 'next/link';

// Компонент для отображения информации о питомце
const AnimalInfo = ({ animalId }: { animalId: number }) => {
  const { data: animal, isLoading } = useGetAnimalByIdQuery(animalId);
  
  if (isLoading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (!animal) return <div className="text-sm text-muted-foreground">Информация недоступна</div>;
  
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm">
        <span className="font-medium">{animal.name}</span>
        <span className="text-muted-foreground mx-1">·</span>
        <span className="text-muted-foreground">
          {animal.view === 'd' ? 'Собака' : 'Кошка'}, {animal.breed}
        </span>
      </div>
    </div>
  );
};

// Компонент для отображения информации о пользователе
const UserAvatar = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  
  if (isLoading || !user) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
        <User className="h-4 w-4 text-gray-500" />
      </div>
    );
  }
  
  const initials = (user.full_name || user.username || 'U')
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return (
    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
      <div className="text-xs text-primary-foreground">{initials}</div>
    </div>
  );
};

// Компонент для отображения сообщения
const MessageItem = ({ 
  message, 
  isCurrentUser, 
  showAvatar = true
}: { 
  message: Message, 
  isCurrentUser: boolean, 
  showAvatar?: boolean 
}) => {
  return (
    <div className={`flex gap-2 mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && showAvatar && (
        <UserAvatar userId={message.user_id} />
      )}
      <div className={`max-w-[80%] px-3 py-2 rounded-lg ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <div className="text-sm break-words">{message.text}</div>
        <div className="text-xs mt-1 opacity-70 text-right">
          {new Date(message.sent_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {isCurrentUser && showAvatar && (
        <UserAvatar userId={message.user_id} />
      )}
    </div>
  );
};

// Группируем сообщения от одного пользователя, отправленные в течение 5 минут
const groupMessages = (messages: Message[], currentUserId: string) => {
  const result: { message: Message, isCurrentUser: boolean, showAvatar: boolean }[] = [];
  
  messages.forEach((message, index) => {
    const isCurrentUser = message.user_id === currentUserId;
    let showAvatar = true;
    
    if (index > 0) {
      const prevMessage = messages[index - 1];
      const prevMessageTime = new Date(prevMessage.sent_at).getTime();
      const currentMessageTime = new Date(message.sent_at).getTime();
      const timeDiff = (currentMessageTime - prevMessageTime) / (60 * 1000); // разница в минутах
      
      // Если сообщения от одного пользователя и отправлены в течение 5 минут, скрываем аватар
      if (prevMessage.user_id === message.user_id && timeDiff < 5) {
        showAvatar = false;
      }
    }
    
    result.push({ message, isCurrentUser, showAvatar });
  });
  
  return result;
};

const ChatPage = (): JSX.Element => {
  const params = useParams();
  const chatId = Number(params.id);
  const { user } = useAppSelector(selectAuthData);
  const router = useRouter();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: chat, isLoading, error } = useGetChatByIdQuery(chatId, { 
    skip: !chatId,
    pollingInterval: 5000, // Обновляем каждые 5 секунд
  });
  
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();
  
  // Прокручиваем к последнему сообщению при загрузке чата или получении новых сообщений
  useEffect(() => {
    if (chat?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages]);
  
  // Перенаправляем неавторизованных пользователей
  useEffect(() => {
    // Удаляем автоматическое перенаправление, чтобы показать пользователю кнопку входа
  }, [user, router]);
  
  // Помечаем сообщения как прочитанные при просмотре чата
  useEffect(() => {
    if (user?.id && chat?.id) {
      markMessagesAsRead({ chat_id: chat.id, user_id: user.id })
        .unwrap()
        .catch(error => {
          console.error('Error marking messages as read:', error);
        });
    }
  }, [chat?.id, chat?.messages, user?.id, markMessagesAsRead]);
  
  if (!user) {
    return (
      <Card className="p-4">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-4">Для доступа к чату необходимо авторизоваться</p>
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
    return <LoadingCard message="Загрузка чата..." />;
  }
  
  if (error) {
    return <ErrorCard message="Не удалось загрузить чат" />;
  }
  
  if (!chat) {
    return (
      <Card className="p-4">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Чат не найден</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/projects/hard/pets-tinder/pages/chat')}
          >
            Вернуться к списку чатов
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Проверяем, является ли пользователь участником чата
  const isParticipant = chat.participants.some(p => p.user_id === user.id);
  if (!isParticipant) {
    return (
      <Card className="p-4">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">У вас нет доступа к этому чату</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/projects/hard/pets-tinder/pages/chat')}
          >
            Вернуться к списку чатов
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Получаем второго участника чата
  const otherParticipant = chat.participants.find(p => p.user_id !== user.id);
  const otherUserId = otherParticipant?.user_id;
  
  // Группируем сообщения
  const groupedMessages = groupMessages(chat.messages, user.id);
  
  // Отправка сообщения
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    try {
      await sendMessage({
        chat_id: chat.id,
        user_id: user.id,
        text: messageText.trim(),
      }).unwrap();
      
      setMessageText('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  return (
    <Card className="p-0 h-[calc(100vh-200px)] flex flex-col">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => router.push('/projects/hard/pets-tinder/pages/chat')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            {otherUserId && <UserAvatar userId={otherUserId} />}
            
            <div>
              {otherUserId ? (
                <UserInfoHeader userId={otherUserId} />
              ) : (
                <CardTitle className="text-base">Чат</CardTitle>
              )}
              <AnimalInfo animalId={chat.animals_id} />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 overflow-y-auto">
        {chat.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Начните общение первым сообщением</p>
          </div>
        ) : (
          <div className="space-y-2">
            {groupedMessages.map(({ message, isCurrentUser, showAvatar }, index) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                isCurrentUser={isCurrentUser} 
                showAvatar={showAvatar}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Введите сообщение..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isSending}
            className="flex-grow"
            autoComplete="off"
          />
          <Button type="submit" disabled={isSending || !messageText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

// Компонент для отображения информации о пользователе в заголовке
const UserInfoHeader = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  
  if (isLoading) return <div className="text-base font-medium">Загрузка...</div>;
  if (!user) return <div className="text-base font-medium">Пользователь не найден</div>;
  
  return (
    <div className="text-base font-medium">
      {user.full_name || user.username}
      {user.is_active ? (
        <Badge variant="outline" className="ml-2 text-xs bg-green-100">Онлайн</Badge>
      ) : null}
    </div>
  );
};

export default ChatPage;