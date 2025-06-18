'use client';

import { JSX, useEffect, useState } from 'react';
import { supabase } from '@/app/projects/hard/chat/utils';
import { Spinner } from '@/components/ui';
import { NewChat } from './new-chat';

interface ChatListProps {
  userId: string;
  activeChat: number | null;
  onChatSelect: (chatId: number) => void;
}

interface ChatItem {
  id: number;
  participants: {
    id: string;
    username: string;
    full_name: string;
  }[];
  last_message: string | null;
  updated_at: string;
}

export const ChatList = ({ userId, activeChat, onChatSelect }: ChatListProps): JSX.Element => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      
      // Получаем все чаты, в которых участвует пользователь
      const { data: chatParticipants, error: chatError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', userId);

      if (chatError) throw new Error(chatError.message);
      
      if (!chatParticipants || chatParticipants.length === 0) {
        setChats([]);
        setIsLoading(false);
        return;
      }

      const chatIds = chatParticipants.map(cp => cp.chat_id);
      
      // Получаем информацию о чатах
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('id, updated_at')
        .in('id', chatIds)
        .order('updated_at', { ascending: false });
        
      if (chatsError) throw new Error(chatsError.message);
      
      // Для каждого чата получаем участников и последнее сообщение
      const chatsWithDetails = await Promise.all(chatsData.map(async (chat) => {
        // Получаем всех участников чата
        const { data: participants, error: participantsError } = await supabase
          .from('chat_participants')
          .select('user_id')
          .eq('chat_id', chat.id);
          
        if (participantsError) throw new Error(participantsError.message);
        
        const userIds = participants.map(p => p.user_id);
        
        // Получаем информацию о пользователях
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, username, full_name')
          .in('id', userIds)
          .neq('id', userId); // Исключаем текущего пользователя
          
        if (usersError) throw new Error(usersError.message);
        
        // Получаем последнее сообщение в чате
        const { data: lastMessage, error: messageError } = await supabase
          .from('messages')
          .select('text')
          .eq('chat_id', chat.id)
          .order('sent_at', { ascending: false })
          .limit(1);
          
        if (messageError) throw new Error(messageError.message);
        
        return {
          id: chat.id,
          participants: users,
          last_message: lastMessage && lastMessage.length > 0 ? lastMessage[0].text : null,
          updated_at: chat.updated_at,
        };
      }));
      
      setChats(chatsWithDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке чатов');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    
    // Подписываемся на обновления чатов
    const subscription = supabase
      .channel('chats_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chats' }, (payload) => {
        fetchChats();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const handleChatCreated = (chatId: number) => {
    fetchChats();
    onChatSelect(chatId);
  };

  return (
    <div className="w-1/3 border-r overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-2">Чаты</h2>
        <NewChat userId={userId} onChatCreated={handleChatCreated} />
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : chats.length === 0 ? (
        <div className="p-4 text-center text-gray-500">У вас пока нет чатов</div>
      ) : (
        <ul className="flex-1">
          {chats.map((chat) => (
            <li 
              key={chat.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeChat === chat.id ? 'bg-blue-50' : ''}`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="font-medium">
                {chat.participants.map(p => p.full_name || p.username).join(', ')}
              </div>
              {chat.last_message && (
                <div className="text-sm text-gray-500 truncate">
                  {chat.last_message}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(chat.updated_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 