'use client';

import { useEffect } from 'react';
import { setLoading, setSession, setUser, useAppDispatch } from '@/app/projects/hard/todo-list/redux';
import { supabase } from '@/app/projects/hard/todo-list/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Компонент инициализации аутентификации
 * 
 * @description Компонент, отвечающий за инициализацию состояния аутентификации при загрузке приложения.
 * Выполняет следующие задачи:
 * 1. Проверяет наличие активной сессии пользователя
 * 2. Сохраняет данные сессии и пользователя в Redux-хранилище
 * 3. Настраивает слушатель изменений состояния аутентификации
 * 4. Управляет состоянием загрузки аутентификации
 * 
 * Компонент не рендерит никакой UI (возвращает null) и предназначен для размещения
 * высоко в дереве компонентов для обеспечения доступа к данным аутентификации
 * во всем приложении.
 * 
 * @returns {null} Компонент не рендерит UI
 */
export const AuthInitializer = () => {
  /**
   * Функция dispatch из Redux для отправки действий
   */
  const dispatch = useAppDispatch();
  const router = useRouter();

  /**
   * Эффект для инициализации аутентификации при монтировании компонента
   * 
   * @see {@link https://supabase.com/docs/reference/javascript/auth-getsession Supabase Auth getSession}
   * @see {@link https://supabase.com/docs/reference/javascript/auth-onauthstatechange Supabase Auth onAuthStateChange}
   */
  useEffect(() => {
    /**
     * Асинхронная функция для инициализации аутентификации
     * 
     * @async
     * @returns {Promise<void>}
     */
    const initAuth = async () => {
      try {
        // Получение текущей сессии пользователя из Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        // Обработка ошибки получения сессии
        if (error) {
          console.error('Error getting auth session:', error);
          
          // Если ошибка связана с refresh token, перенаправляем на страницу входа
          if (error.message.includes('Refresh Token') || error.message.includes('Invalid JWT')) {
            // Очищаем сессию
            await supabase.auth.signOut();
            toast.error('Your session has expired. Please sign in again.');
            router.push('/projects/hard/todo-list');
          }
          
          dispatch(setLoading(false));
          return;
        }

        // Если сессия существует, сохраняем данные в Redux
        if (session) {
          dispatch(setSession(session));
          dispatch(setUser(session.user));
        }

        // Настройка слушателя изменений состояния аутентификации
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          /**
           * Обработчик изменения состояния аутентификации
           * 
           * @param {string} event - Тип события аутентификации
           * @param {Session | null} session - Объект сессии или null при выходе
           */
          (event, session) => {
            // Обрабатываем различные события аутентификации
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              dispatch(setSession(session));
              dispatch(setUser(session?.user ?? null));
            } else if (event === 'SIGNED_OUT') {
              dispatch(setSession(null));
              dispatch(setUser(null));
              router.push('/projects/hard/todo-list');
            } else if (event === 'USER_UPDATED') {
              dispatch(setUser(session?.user ?? null));
            }
          },
        );

        // Завершение загрузки
        dispatch(setLoading(false));

        // Функция очистки для отписки от слушателя при размонтировании
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        // Обработка непредвиденных ошибок
        console.error('Error initializing auth:', error);
        dispatch(setLoading(false));
      }
    };

    // Запуск инициализации
    initAuth();
  }, [dispatch, router]);

  // Компонент не рендерит UI
  return null;
};