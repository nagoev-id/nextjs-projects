'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/projects/hard/chat/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setError, setLoading, setSession, setUser, useAppDispatch } from '@/app/projects/hard/chat/redux';

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting auth session:', error);
          
          if (error.message.includes('Refresh Token') || error.message.includes('Invalid JWT')) {
            await supabase.auth.signOut();
            toast.error('Your session has expired. Please sign in again.');
            router.push('/projects/hard/chat');
          }

          dispatch(setError(error.message));
          dispatch(setLoading(false));
          return;
        }

        if (session) {
          dispatch(setSession(session));
          dispatch(setUser(session.user));
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              dispatch(setSession(session));
              dispatch(setUser(session?.user ?? null));
            } else if (event === 'SIGNED_OUT') {
              dispatch(setSession(null));
              dispatch(setUser(null));
              router.push('/projects/hard/chat');
            } else if (event === 'USER_UPDATED') {
              dispatch(setUser(session?.user ?? null));
            }
          },
        );

        dispatch(setLoading(false));

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing app:', error);
        dispatch(setLoading(false));
      }
    };

    initApp();
  }, [dispatch, router]);

  return null;
};

export default AuthInitializer;