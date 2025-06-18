'use client';

import { JSX, useState, useEffect } from 'react';
import { Button, Spinner } from '@/components/ui';
import { supabase } from '@/app/projects/hard/chat/utils';

interface NewChatProps {
  userId: string;
  onChatCreated: (chatId: number) => void;
}

interface User {
  id: string;
  username: string;
  full_name: string;
}

export const NewChat = ({ userId, onChatCreated }: NewChatProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: usersError } = await supabase
        .from('users')
        .select('id, username, full_name')
        .neq('id', userId);
        
      if (usersError) throw new Error(usersError.message);
      
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке пользователей');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async () => {
    if (!selectedUser) return;
    
    try {
      setIsCreating(true);
      setError(null);
      
      // Проверяем, существует ли уже чат между этими пользователями
      const { data: existingChats, error: checkError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', userId);
        
      if (checkError) throw new Error(checkError.message);
      
      if (existingChats && existingChats.length > 0) {
        const chatIds = existingChats.map(chat => chat.chat_id);
        
        const { data: otherParticipants, error: participantsError } = await supabase
          .from('chat_participants')
          .select('chat_id, user_id')
          .in('chat_id', chatIds)
          .eq('user_id', selectedUser);
          
        if (participantsError) throw new Error(participantsError.message);
        
        // Если чат уже существует, просто открываем его
        if (otherParticipants && otherParticipants.length > 0) {
          setIsOpen(false);
          onChatCreated(otherParticipants[0].chat_id);
          return;
        }
      }
      
      // Создаем новый чат
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({})
        .select();
        
      if (chatError) throw new Error(chatError.message);
      
      // Добавляем текущего пользователя как участника
      const { error: currentUserError } = await supabase
        .from('chat_participants')
        .insert({
          chat_id: newChat[0].id,
          user_id: userId
        });
        
      if (currentUserError) throw new Error(currentUserError.message);
      
      // Добавляем выбранного пользователя как участника
      const { error: selectedUserError } = await supabase
        .from('chat_participants')
        .insert({
          chat_id: newChat[0].id,
          user_id: selectedUser
        });
        
      if (selectedUserError) throw new Error(selectedUserError.message);
      
      setIsOpen(false);
      onChatCreated(newChat[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании чата');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button 
        className="w-full mb-4" 
        onClick={() => setIsOpen(true)}
      >
        Новый чат
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4">Новый чат</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Выберите пользователя для чата:
              </label>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Нет доступных пользователей
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border rounded">
                  {users.map((user) => (
                    <div 
                      key={user.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedUser === user.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedUser(user.id)}
                    >
                      <div className="font-medium">{user.full_name || user.username}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isCreating}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleCreateChat}
                disabled={!selectedUser || isCreating}
              >
                {isCreating ? <Spinner /> : 'Создать чат'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 