'use client';

/**
 * # Список пользователей GitHub
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и загрузка данных**:
 *    - При монтировании компонента выполняется асинхронный запрос к GitHub API для получения списка пользователей
 *    - Во время загрузки отображается индикатор загрузки (спиннер)
 *    - Данные запрашиваются с параметрами: начиная с ID 1, по 40 пользователей на запрос
 *
 * 2. **Управление состоянием**:
 *    - Состояние компонента хранит массив пользователей и флаги состояния загрузки
 *    - Используется единый объект состояния для отслеживания загрузки, ошибок и успешного получения данных
 *    - При ошибке загрузки отображается информативное сообщение и уведомление
 *
 * 3. **Пагинация**:
 *    - Данные разбиваются на страницы по 10 пользователей с помощью кастомного хука usePagination
 *    - Пользователь может переключаться между страницами с помощью кнопок "Prev" и "Next"
 *    - Также доступна прямая навигация по номерам страниц
 *    - Кнопки навигации автоматически отключаются на первой и последней странице
 *
 * 4. **Отображение пользователей**:
 *    - Каждый пользователь представлен карточкой с аватаром, именем и ссылкой на профиль
 *    - Используется адаптивная сетка: 1 колонка на мобильных устройствах, 2 на планшетах и 4 на десктопах
 *    - Изображения аватаров оптимизированы с помощью компонента Next.js Image
 *
 * 5. **Обработка ошибок**:
 *    - При сбое запроса к API отображается сообщение об ошибке
 *    - Ошибки логируются в консоль для отладки
 *    - Используются уведомления toast для информирования пользователя
 *
 * 6. **Доступность**:
 *    - Используются семантические HTML-элементы для улучшения доступности
 *    - Кнопки пагинации имеют соответствующие атрибуты aria
 *    - Изображения содержат альтернативный текст
 */


import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { usePagination } from '@/app/projects/easy/github-users-list/hooks';
import { toast } from 'sonner';

/**
 * Тип, представляющий пользователя GitHub.
 * @typedef {Object} GitHubUser
 * @property {string} login - Имя пользователя на GitHub.
 * @property {string} avatar_url - URL аватара пользователя.
 * @property {string} html_url - URL профиля пользователя на GitHub.
 */

type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
}

/**
 * Тип, представляющий начальное состояние компонента.
 * @typedef {Object} InitialState
 * @property {GitHubUser[]} users - Массив пользователей GitHub.
 * @property {boolean} isLoading - Флаг, указывающий на процесс загрузки данных.
 * @property {boolean} isError - Флаг, указывающий на наличие ошибки при загрузке.
 * @property {boolean} isSuccess - Флаг, указывающий на успешную загрузку данных.
 */
type InitialState = {
  users: GitHubUser[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Компонент страницы со списком пользователей GitHub.
 * @type {React.FC}
 * @returns {JSX.Element} Отрендеренный компонент страницы.
 */
const GitHubUsersListPage = (): JSX.Element => {
  const [initialState, setInitialState] = useState<InitialState>({
    users: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const {
    currentPage,
    paginatedData,
    handlePaginationClick,
    handlePaginationNumberClick,
  } = usePagination(initialState.users, 10);

  /**
   * Асинхронная функция для загрузки пользователей GitHub.
   * @function
   * @async
   * @returns {Promise<() => void>} Функция для отмены запроса.
   */
  const loadGitHubUsers = useCallback(async () => {
    const controller = new AbortController();

    try {
      setInitialState((prev) => ({ ...prev, isLoading: true }));
      const { data } = await axios.get<GitHubUser[]>('https://api.github.com/users', {
        params: { since: 1, per_page: 40 },
        signal: controller.signal,
      });
      setInitialState((prev) => ({ ...prev, isLoading: false, isSuccess: true, users: data }));
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('An error occurred:', error);
        setInitialState((prev) => ({ ...prev, isLoading: false, isError: true, users: [] }));
        toast.error('Failed to fetch users from GitHub API.', { richColors: true });
      }
    }

    return () => controller.abort();
  }, []);

  /**
   * Загружает пользователей GitHub при монтировании компонента.
   * Отменяет запрос при размонтировании.
   */
  useEffect(() => {
    const abortController = loadGitHubUsers();
    return () => {
      abortController.then(abort => abort());
    };
  }, [loadGitHubUsers]);

  /**
   * Мемоизированный UI компонент пагинации.
   * @function
   * @returns {JSX.Element|null} Отрендеренный компонент пагинации или null.
   */
  const paginationUI = useMemo(() => {
    if (!paginatedData.length) return null;

    return (
      <nav aria-label="Pagination" className="mt-4">
        <ul className="flex flex-wrap items-center justify-center gap-2">
          <li>
            <Button
              onClick={() => handlePaginationClick('prev')}
              disabled={currentPage <= 0}
              aria-label="Previous page"
            >
              Prev
            </Button>
          </li>
          {[...Array(paginatedData.length)].map((_, index) => (
            <li key={index}>
              <Button
                onClick={() => handlePaginationNumberClick(index)}
                disabled={currentPage === index}
                aria-label={`Page ${index + 1}`}
                aria-current={currentPage === index ? 'page' : undefined}
              >
                {String(index + 1)}
              </Button>
            </li>
          ))}
          <li>
            <Button
              onClick={() => handlePaginationClick('next')}
              disabled={currentPage >= paginatedData.length - 1}
              aria-label="Next page"
            >
              Next
            </Button>
          </li>
        </ul>
      </nav>
    );
  }, [currentPage, paginatedData.length, handlePaginationClick, handlePaginationNumberClick]);

  /**
   * Мемоизированный список пользователей.
   * @function
   * @returns {JSX.Element|null} Отрендеренный список пользователей или null.
   */
  const userList = useMemo(() => {
    if (!paginatedData[currentPage]?.length) return null;

    return (
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {paginatedData[currentPage].map(({ login, avatar_url, html_url }) => (
          <li key={login}>
            <Card className="p-0 overflow-hidden gap-0 h-full flex flex-col">
              <div className="relative w-full h-48">
                <Image
                  fill
                  className="object-cover"
                  src={avatar_url}
                  alt={`Avatar of ${login}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  priority={currentPage === 0}
                  loading={currentPage === 0 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="flex flex-col items-center gap-2 p-4 flex-grow">
                <h4 className="font-bold uppercase">{login}</h4>
                <Link
                  href={html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  <Button>View profile</Button>
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    );
  }, [currentPage, paginatedData]);

  return (
    <Card className="max-w-5xl w-full mx-auto p-4 rounded bg-card-none shadow-none border-none">
      {initialState.isLoading && <Spinner aria-label="Loading GitHub users" />}

      {initialState.isError && (
        <p className="text-red-500 text-center" role="alert">
          Failed to load users. Please try again later.
        </p>
      )}

      {initialState.isSuccess && initialState.users.length > 0 && (
        <>
          {userList}
          {paginationUI}
        </>
      )}
    </Card>
  );
};

export default GitHubUsersListPage;
