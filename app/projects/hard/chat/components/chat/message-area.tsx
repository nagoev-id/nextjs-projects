'use client';

import { JSX, useEffect, useState, useRef } from 'react';
import { supabase } from '@/app/projects/hard/chat/utils';
import { Button, Spinner } from '@/components/ui';

interface MessageAreaProps {
  userId: string;
  chatId: number | null;
}

interface Message {
  id: number;
  text: string;
  user_id: string;
  sent_at: string;
  is_read: boolean;
  user?: {
    username: string;
    full_name: string;
  };
}

export const MessageArea = ({ userId, chatId }: MessageAreaProps): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Получаем сообщения для текущего чата
        const { data, error: messagesError } = await supabase
          .from('messages')
          .select('id, text, user_id, sent_at, is_read')
          .eq('chat_id', chatId)
          .order('sent_at', { ascending: true });
          
        if (messagesError) throw new Error(messagesError.message);
        
        // Получаем информацию о пользователях, отправивших сообщения
        const userIds = [...new Set(data.map(msg => msg.user_id))];
        
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, username, full_name')
          .in('id', userIds);
          
        if (usersError) throw new Error(usersError.message);
        
        // Объединяем данные сообщений с данными пользователей
        const messagesWithUsers = data.map(message => {
          const user = users.find(u => u.id === message.user_id);
          return { ...message, user };
        });
        
        setMessages(messagesWithUsers);
        
        // Отмечаем сообщения как прочитанные
        if (data.some(msg => msg.user_id !== userId && !msg.is_read)) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('chat_id', chatId)
            .neq('user_id', userId)
            .eq('is_read', false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке сообщений');
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    };
    
    fetchMessages();
    
    // Подписываемся на новые сообщения
    const subscription = supabase
      .channel(`chat_${chatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        fetchMessages();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatId || !newMessage.trim()) return;
    
    try {
      setError(null);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          user_id: userId,
          text: newMessage.trim(),
          is_read: false
        });
        
      if (error) throw new Error(error.message);
      
      // Обновляем время последнего сообщения в чате
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);
        
      setNewMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при отправке сообщения');
    }
  };

  if (!chatId) {
    return (
      <div className="w-2/3 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Выберите чат для общения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col">
      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center"><Spinner /></div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">Нет сообщений</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.user_id === userId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.user_id !== userId && (
                    <div className="font-medium text-sm mb-1">
                      {message.user?.full_name || message.user?.username || 'Пользователь'}
                    </div>
                  )}
                  <div>{message.text}</div>
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(message.sent_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Форма отправки сообщения */}
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          Отправить
        </Button>
      </form>
    </div>
  );
}; 