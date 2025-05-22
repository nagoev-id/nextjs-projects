'use client';

/**
 * # Генератор случайных пользователей
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение выполняет запрос к API randomuser.me для получения случайных данных пользователя
 *    - Используется кастомный хук useAxios для управления состоянием запроса (загрузка, ошибка, данные)
 *    - Начальное состояние устанавливает активную категорию "name" без значения
 *
 * 2. **Получение данных пользователя**:
 *    - Функция handleFetchUserData выполняет асинхронный запрос к API
 *    - Полученные данные форматируются в структуру UserData с нужными полями
 *    - После успешного получения данных обновляется состояние userData и активная категория
 *
 * 3. **Управление категориями**:
 *    - Пользователь может переключаться между разными категориями информации (имя, email, возраст и т.д.)
 *    - При нажатии на иконку категории вызывается функция handleCategoryChange
 *    - Функция обновляет активную категорию и отображаемое значение
 *
 * 4. **Отображение интерфейса**:
 *    - Во время загрузки данных показывается компонент Spinner
 *    - При ошибке отображается сообщение об ошибке
 *    - Основной интерфейс включает аватар пользователя, текущую выбранную информацию и кнопки категорий
 *    - Кнопка "Generate" позволяет получить данные нового случайного пользователя
 *
 * 5. **Оптимизация производительности**:
 *    - Используются хуки useCallback для мемоизации функций
 *    - Зависимости эффектов и колбэков тщательно контролируются
 *    - Условный рендеринг применяется для разных состояний приложения
 */

import React, { ComponentType, JSX, useCallback, useEffect, useState } from 'react';
import { FaAt, FaLock, FaPhone, FaRegCalendarCheck, FaRegCircleUser, FaRegMap } from 'react-icons/fa6';
import { useAxios } from '@/shared/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';

/**
 * Тип для категории информации о пользователе
 * @property {string} name - Название категории (например, 'name', 'email')
 * @property {ComponentType} src - React-компонент иконки для отображения категории
 */
type Category = {
  name: string;
  src: ComponentType;
}

/**
 * Тип для активной выбранной категории
 * @property {string} name - Название активной категории
 * @property {string} value - Значение активной категории для текущего пользователя
 */
type ActiveCategory = {
  name: string;
  value: string;
}

/**
 * Тип для хранения данных пользователя
 * @property {string} phone - Номер телефона пользователя
 * @property {string} email - Email адрес пользователя
 * @property {string} image - URL изображения пользователя
 * @property {string} street - Адрес пользователя
 * @property {string} password - Пароль пользователя
 * @property {string} name - Полное имя пользователя
 * @property {number} age - Возраст пользователя
 */
type UserData = {
  phone: string;
  email: string;
  image: string;
  street: string;
  password: string;
  name: string;
  age: number;
}

/**
 * Тип для ответа API randomuser.me
 * @property {Array} results - Массив результатов с данными пользователей
 */
type RandomUserApiResponse = {
  results: Array<{
    name: { first: string; last: string };
    email: string;
    phone: string;
    dob: { age: number };
    location: { street: { number: number; name: string } };
    login: { password: string };
    picture: { large: string };
  }>;
}

/**
 * Массив доступных категорий информации о пользователе с соответствующими иконками
 */
const mock: Category[] = [
  { name: 'name', src: FaRegCircleUser },
  { name: 'email', src: FaAt },
  { name: 'age', src: FaRegCalendarCheck },
  { name: 'street', src: FaRegMap },
  { name: 'phone', src: FaPhone },
  { name: 'password', src: FaLock },
];

/**
 * Компонент генератора случайных пользователей
 * Отображает информацию о случайном пользователе с возможностью
 * переключения между различными категориями данных и генерации новых пользователей
 *
 * @returns {JSX.Element} Компонент страницы генератора случайных пользователей
 */
const RandomUserGeneratorPage = (): JSX.Element => {
  // Получение данных и состояния запроса через кастомный хук
  const { loading, error, fetchData } = useAxios<RandomUserApiResponse>();
  // Состояние для хранения данных текущего пользователя
  const [userData, setUserData] = useState<UserData | null>(null);

  // Состояние для хранения активной категории и её значения
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>({ name: mock[0].name, value: '' });

  /**
   * Получает данные случайного пользователя из API и обновляет состояние
   * @returns {Promise<void>}
   */
  const handleFetchUserData = useCallback(async (): Promise<void> => {
    try {
      const response = await fetchData('https://randomuser.me/api/');
      if (response && response.results && response.results.length > 0) {
        const user = response.results[0];
        const formattedUserData: UserData = {
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          phone: user.phone,
          age: user.dob.age,
          street: `${user.location.street.number} ${user.location.street.name}`,
          password: user.login.password,
          image: user.picture.large,
        };

        setUserData(formattedUserData);
        setActiveCategory({
          name: mock[0].name,
          value: formattedUserData.name,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [fetchData]);

  /**
   * Обрабатывает изменение активной категории
   * @param {string} name - Название выбранной категории
   * @returns {void}
   */
  const handleCategoryChange = useCallback((name: string): void => {
    if (!userData) return;

    setActiveCategory({
      name,
      value: String(userData[name as keyof UserData]),
    });
  }, [userData]);

  // Загрузка данных пользователя при первом рендере
  useEffect(() => {
    handleFetchUserData();
  }, [handleFetchUserData]);

  // Отображение состояния загрузки
  if (loading) return <Spinner />;

  // Отображение состояния ошибки
  if (error) {
    return (
      <p className="text-red-500 text-center font-medium">
        Failed to fetch user data. Please try again later.
      </p>
    );
  }

  // Если данные еще не загружены
  if (!userData) return <></>;

  return (
    <Card className="grid gap-3 max-w-sm w-full mx-auto p-4 rounded">
      {/* Аватар пользователя */}
      <Image
        width={132}
        height={132}
        priority
        className="mx-auto rounded-full border-2 border-black"
        src={userData.image}
        alt={`Avatar of ${userData.name}`}
      />

      {/* Отображение активной категории */}
      <p className="flex flex-wrap justify-center gap-1">
        <span>My {activeCategory.name} is</span>
        <span className="break-all font-medium">{activeCategory.value}</span>
      </p>

      {/* Кнопки категорий */}
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {mock.map(({ name, src }) => (
          <li key={name}>
            <Button
              variant="outline"
              className={name === activeCategory.name ? 'bg-slate-200' : ''}
              onClick={() => handleCategoryChange(name)}
              aria-pressed={name === activeCategory.name}
            >
              {React.createElement(src)}
            </Button>
          </li>
        ))}
      </ul>

      {/* Кнопка генерации нового пользователя */}
      <Button className="w-full" onClick={handleFetchUserData}>
        Generate
      </Button>
    </Card>
  );
};

export default RandomUserGeneratorPage;