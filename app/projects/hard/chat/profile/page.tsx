'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Spinner } from '@/components/ui';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/chat/redux';
import { supabase } from '@/app/projects/hard/chat/utils';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  full_name: string;
}

const ProfilePage = (): JSX.Element => {
  const { user, isLoading: authLoading } = useAppSelector(selectAuthData);
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/projects/hard/chat/sign');
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error: profileError } = await supabase
          .from('users')
          .select('id, username, email, phone, full_name')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw new Error(profileError.message);
        
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке профиля');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/projects/hard/chat/sign');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при выходе из системы');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user || !profile) {
    return <div className="flex items-center justify-center h-screen">Профиль не найден</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Профиль пользователя</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium">Имя пользователя:</div>
          <div>{profile.username}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium">Email:</div>
          <div>{profile.email}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium">Полное имя:</div>
          <div>{profile.full_name}</div>
        </div>
        
        {profile.phone && (
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">Телефон:</div>
            <div>{profile.phone}</div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button onClick={() => router.push('/projects/hard/chat')}>
          Вернуться к чатам
        </Button>
        <Button variant="destructive" onClick={handleSignOut}>
          Выйти из аккаунта
        </Button>
      </div>
    </Card>
  );
};

export default ProfilePage;