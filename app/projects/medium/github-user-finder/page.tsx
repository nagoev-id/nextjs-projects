'use client';

/**
 * # GitHub User Finder
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка формы**:
 *    - Приложение использует React Hook Form с Zod для валидации поля ввода
 *    - Форма содержит одно поле для ввода имени пользователя GitHub
 *    - Валидация происходит в режиме реального времени при изменении поля
 *
 * 2. **Поиск пользователей**:
 *    - При отправке формы выполняется запрос к GitHub API через кастомный хук useLazyGetQuery
 *    - Во время загрузки отображается индикатор Spinner
 *    - Обработка ошибок реализована через try-catch блок с выводом уведомлений
 *
 * 3. **Отображение результатов**:
 *    - Результаты поиска отображаются в виде сетки карточек пользователей
 *    - Каждая карточка содержит аватар, логин пользователя и кнопку для просмотра деталей
 *    - Адаптивная сетка меняет количество колонок в зависимости от размера экрана
 *
 * 4. **Навигация к деталям пользователя**:
 *    - Каждая карточка содержит ссылку на страницу с подробной информацией о пользователе
 *    - Используется компонент Link из Next.js для клиентской навигации без перезагрузки страницы
 *
 * 5. **Обработка состояний**:
 *    - Реализована обработка всех возможных состояний: загрузка, ошибка, пустой результат, успешный поиск
 *    - Для каждого состояния предусмотрено соответствующее UI-представление
 *
 * 6. **Оптимизация производительности**:
 *    - Функция отправки формы мемоизирована с помощью useCallback
 *    - Используются условные рендеры для предотвращения лишних обновлений DOM
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import React, { JSX, useCallback, useMemo } from 'react';
import { useLazyGetQuery, User } from '@/app/projects/medium/github-user-finder/features';
import { FormSchema, formSchema } from '@/app/projects/medium/github-user-finder/utils';
import { toast } from 'sonner';
import { FormInput } from '@/components/layout';

const UserCard = React.memo(({ user }: { user: User }) => (
  <Card className="p-0 gap-0 overflow-hidden rounded-sm">
    <Image width="100" height="100" className="rounded w-full" src={user.avatar_url} alt={user.login} />
    <div className="p-2 grid place-items-center gap-2">
      <h3 className="font-bold uppercase text-center">{user.login}</h3>
      <Link className="flex justify-center" href={`/projects/medium/github-user-finder/user/${user.login}`}>
        <Button>View Detail</Button>
      </Link>
    </div>
  </Card>
));

UserCard.displayName = 'UserCard';

const GitHubUserFinderPage = (): JSX.Element => {
  const [searchUsers, { isLoading, isError, isSuccess, data: users }] = useLazyGetQuery();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { login: '' },
    mode: 'onChange',
  });

  const onSubmit = useCallback(async ({ login }: FormSchema) => {
    try {
      await searchUsers(login);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to search GitHub users', { richColors: true });
    }
  }, [searchUsers]);

  const renderForm = useCallback(() => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
        <FormInput
          form={form}
          name='login'
          label='Enter Github Username:'
          placeholder='nagoev-alim'
        />
        <Button className="max-w-max" type="submit">Submit</Button>
      </form>
    </Form>
  ), [form, onSubmit]);

  const userList = useMemo(() => (
    isSuccess && users && users.length > 0 && (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {users.map((user: User) => (
          <li key={user.id}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    )
  ), [isSuccess, users]);

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (isError) return <p className="text-red-400 font-bold text-center">Error fetching users</p>;
    if (isSuccess && (!users || users.length === 0)) return <p>No users found</p>;
    return userList;
  };

  return (
    <Card className="grid gap-3 p-4">
      {renderForm()}
      {renderContent()}
    </Card>
  );
};

export default GitHubUserFinderPage;