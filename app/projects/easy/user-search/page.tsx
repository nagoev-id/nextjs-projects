'use client';

/**
 * # Поиск пользователей
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация**:
 *    - При загрузке приложение генерирует список из 30 случайных пользователей с помощью библиотеки faker
 *    - Для каждого пользователя создается объект с id, именем, фамилией, профессией и поисковым текстом
 *    - Поисковый текст формируется из имени, фамилии и профессии в нижнем регистре для облегчения поиска
 * 
 * 2. **Состояние приложения**:
 *    - Список пользователей хранится в состоянии users
 *    - Поисковый запрос хранится в состоянии search
 *    - Состояние загрузки отслеживается через isLoading
 *    - Ошибки сохраняются в состоянии error
 * 
 * 3. **Поиск**:
 *    - Пользователь вводит текст в поисковое поле
 *    - Для оптимизации производительности используется debounce (300мс)
 *    - Это предотвращает слишком частые перерисовки при быстром вводе
 * 
 * 4. **Фильтрация**:
 *    - Функция filterUsers фильтрует пользователей по введенному тексту
 *    - Поиск выполняется по полю searchText, которое содержит имя, фамилию и профессию
 *    - Результаты фильтрации кэшируются с помощью useMemo для оптимизации производительности
 * 
 * 5. **Отображение результатов**:
 *    - Отфильтрованные пользователи отображаются в виде списка
 *    - Для каждого пользователя показывается имя, фамилия и профессия
 *    - Если пользователей не найдено, отображается соответствующее сообщение
 *    - При загрузке данных показывается индикатор загрузки
 */

import { faker } from '@faker-js/faker';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChangeEvent, JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/shared/hooks';

/**
 * Интерфейс для объекта пользователя
 * @interface User
 * @property {string} id - Уникальный идентификатор пользователя
 * @property {string} firstName - Имя пользователя
 * @property {string} lastName - Фамилия пользователя
 * @property {string} jobArea - Профессиональная область пользователя
 * @property {string} [searchText] - Текст для поиска (имя, фамилия и профессия в нижнем регистре)
 */
type User = {
  id: string;
  firstName: string;
  lastName: string;
  jobArea: string;
  searchText?: string;
}

/**
 * Компонент страницы поиска пользователей
 * Позволяет генерировать случайных пользователей и осуществлять поиск по ним
 * 
 * @returns {JSX.Element} Компонент страницы поиска пользователей
 */
const UserSearchPage = (): JSX.Element => {
  /**
   * Состояние для хранения списка пользователей
   */
  const [users, setUsers] = useState<User[]>([]);
  
  /**
   * Состояние для хранения текущего поискового запроса
   */
  const [search, setSearch] = useState<string>('');
  
  /**
   * Состояние для отслеживания процесса загрузки
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /**
   * Состояние для хранения сообщения об ошибке
   */
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Отложенный поисковый запрос для оптимизации производительности
   * Предотвращает частые перерисовки при быстром вводе
   */
  const debouncedSearch = useDebounce(search, 300);

  /**
   * Эффект для генерации случайных пользователей при монтировании компонента
   */
  useEffect(() => {
    try {
      setIsLoading(true);

      // Генерация 30 случайных пользователей
      const generatedUsers: User[] = Array.from({ length: 30 }, () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const jobArea = faker.person.jobArea();

        return {
          id: faker.string.uuid(),
          firstName,
          lastName,
          jobArea,
          searchText: `${firstName} ${lastName} ${jobArea}`.toLowerCase(),
        };
      });

      setUsers(generatedUsers);
      setError(null);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to generate users data');
      console.error('An error occurred:', error);
    }
  }, []);

  /**
   * Функция для фильтрации пользователей по поисковому запросу
   * 
   * @param {string} value - Поисковый запрос
   * @param {User[]} data - Массив пользователей для фильтрации
   * @returns {User[]} Отфильтрованный массив пользователей
   */
  const filterUsers = useCallback((value: string, data: User[]): User[] => {
    const formattedValue = value.trim().toLowerCase();

    // Если поисковый запрос пустой, возвращаем все данные
    if (!formattedValue) {
      return data;
    }

    // Фильтрация пользователей по поисковому тексту
    return data.filter((user) => {
      if (!user.searchText) return false;
      return user.searchText.includes(formattedValue);
    });
  }, []);

  /**
   * Мемоизированный результат фильтрации для оптимизации производительности
   * Пересчитывается только при изменении поискового запроса, списка пользователей или функции фильтрации
   */
  const usersFiltered = useMemo(() => {
    return filterUsers(debouncedSearch, users);
  }, [debouncedSearch, users, filterUsers]);

  /**
   * Обработчик изменения поискового запроса
   * 
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения поля ввода
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  return (
    <Card className="grid gap-3 max-w-2xl w-full mx-auto p-4 rounded">
      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearchChange}
        disabled={isLoading}
        aria-label="Search users"
      />

      {isLoading && <p className="text-center">Loading users...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          {usersFiltered.length === 0 ? (
            <p className="text-center">No users found</p>
          ) : (
            <ul 
              className="max-h-[600px] overflow-auto"
              aria-label="Users list"
            >
              {usersFiltered.map(({ id, firstName, lastName, jobArea }: User) => (
                <li
                  key={id}
                  className="grid sm:flex justify-between items-center gap-1 border p-2 hover:bg-gray-50"
                >
                  <span className="text-lg">{`${firstName} ${lastName}`}</span>
                  <span className="font-medium">{jobArea}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  );
};

export default UserSearchPage;