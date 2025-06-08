'use client';

import { useEffect } from 'react';
import { setLoading, setSession, setUser, useAppDispatch } from '@/app/projects/hard/todo-list/redux';
import { supabase } from '@/app/projects/hard/todo-list/utils';

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
           * @param {string} _event - Тип события аутентификации (не используется)
           * @param {Session | null} session - Объект сессии или null при выходе
           */
          (_event, session) => {
            dispatch(setSession(session));
            dispatch(setUser(session?.user ?? null));
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
  }, [dispatch]);

  // Компонент не рендерит UI
  return null;
};