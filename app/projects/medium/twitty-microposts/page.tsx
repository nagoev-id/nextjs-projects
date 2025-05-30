'use client';

/**
 * # Приложение Twitty Microposts
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и загрузка данных:**
 *    - При загрузке компонента выполняется запрос к API для получения списка постов с помощью хука `useReadQuery`.
 *    - Состояние загрузки, ошибки и успешного получения данных отслеживается через флаги `isLoading`, `isError`, `isSuccess`.
 *
 * 2. **Управление состоянием фильтра:**
 *    - Компонент использует локальное состояние `filter` для хранения текущего значения фильтра постов.
 *    - Функция `setFilter` позволяет обновлять значение фильтра.
 *
 * 3. **Создание новых постов:**
 *    - Компонент `CreatePostForm` предоставляет интерфейс для создания новых постов.
 *    - Новые посты добавляются в общий список после успешного создания.
 *
 * 4. **Отображение списка постов:**
 *    - После успешной загрузки данных, компонент `PostsList` отображает список постов.
 *    - Список постов может быть отфильтрован на основе значения `filter`.
 *
 * 5. **Обработка состояний загрузки и ошибок:**
 *    - Во время загрузки данных отображается компонент `Spinner`.
 *    - В случае ошибки при загрузке данных показывается соответствующее сообщение.
 *
 * 6. **Адаптивный дизайн:**
 *    - Использование компонента `Card` и классов стилей обеспечивает адаптивный и консистентный дизайн.
 *
 * Приложение предоставляет простой и интуитивно понятный интерфейс для создания, просмотра и фильтрации микропостов,
 * обеспечивая быструю загрузку данных и обратную связь пользователю о состоянии операций.
 */

import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { JSX, useState } from 'react';
import { useReadQuery } from '@/app/projects/medium/twitty-microposts/features';
import { CreatePostForm, PostsList } from '@/app/projects/medium/twitty-microposts/components';

/**
 * Компонент страницы Twitty Microposts.
 * 
 * Этот компонент отвечает за отображение основного интерфейса приложения Twitty Microposts.
 * Он включает в себя форму создания новых постов, список существующих постов и обработку
 * различных состояний загрузки данных.
 *
 * @returns {JSX.Element} Отрендеренный компонент страницы Twitty Microposts.
 */
const TwittyMicropostsPage = (): JSX.Element => {
  // Получение данных и состояний загрузки с помощью хука useReadQuery
  const { data: posts, isError, isLoading, isSuccess } = useReadQuery();
  
  // Локальное состояние для хранения значения фильтра постов
  const [filter, setFilter] = useState<string>('');

  return (
    <Card className="p-4">
      <div className="grid gap-3">
        {/* Компонент формы для создания новых постов */}
        <CreatePostForm />
        
        {/* Отображение индикатора загрузки */}
        {isLoading && <Spinner />}
        
        {/* Отображение сообщения об ошибке при неудачной загрузке */}
        {isError && (<div className="text-center text-red-500 font-semibold">Error while fetching posts</div>)}
        
        {/* Отображение списка постов при успешной загрузке */}
        {isSuccess && <PostsList posts={posts} filter={filter} setFilter={setFilter} />}
      </div>
    </Card>
  );
};

export default TwittyMicropostsPage;