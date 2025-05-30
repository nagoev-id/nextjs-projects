'use client';

import { useParams, useRouter } from 'next/navigation';
import { JSX, useCallback, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaCodepen, FaEye, FaInfo, FaLink, FaStar, FaStore, FaUsers, FaUtensils } from 'react-icons/fa6';
import { FaUserFriends } from 'react-icons/fa';
import { Repository, useGetDetailQuery } from '@/app/projects/medium/github-user-finder/features';

/**
 * Компонент детальной страницы пользователя GitHub
 *
 * @component
 * @description Отображает подробную информацию о пользователе GitHub и его репозиториях
 * @returns {JSX.Element} Компонент страницы с детальной информацией о пользователе
 */
const DetailPage = (): JSX.Element => {
  const { login } = useParams();
  const router = useRouter();
  const { data: user, isLoading, isError, isSuccess } = useGetDetailQuery(login as string);

  /**
   * Обработчик для возврата на предыдущую страницу.
   * Использует useCallback для мемоизации функции.
   */
  const handleGoBack = useCallback(() => router.back(), [router]);

  /**
   * Мемоизированный компонент статистики пользователя
   */
  const UserStats = useMemo(() => {
    if (!user) return null;

    const stats = [
      { label: 'Followers', value: user.details.followers, icon: <FaUsers className="w-5 h-5" /> },
      { label: 'Following', value: user.details.following, icon: <FaUserFriends className="w-5 h-5" /> },
      { label: 'Public Repos', value: user.details.public_repos, icon: <FaCodepen className="w-5 h-5" /> },
      { label: 'Public Gists', value: user.details.public_gists, icon: <FaStore className="w-5 h-5" /> },
    ];

    return (
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center space-x-2" role="group" aria-label={`${stat.label} count`}>
                {stat.icon}
                <div>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }, [user]);

  /**
   * Мемоизированный компонент профиля пользователя
   */
  const UserProfile = useMemo(() => {
    if (!user) return null;

    return (
      <Card className="p-4 gap-0">
        <CardHeader>
          <CardTitle>About: {user.details.name || user.details.login}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 p-0">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.details.avatar_url} alt={user.details.login} />
              <AvatarFallback>{user.details.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{user.details.login}</h3>
              <Badge variant="secondary">{user.details.type}</Badge>
              {user.details.hireable && <Badge variant="outline">Hireable</Badge>}
              <p>{user.details.bio}</p>
            </div>
          </div>

          <div className="grid gap-2 justify-items-center">
            <Button variant="outline" className="max-w-max" asChild>
              <a href={user.details.html_url} target="_blank" rel="noreferrer">
                Visit Github Profile
              </a>
            </Button>
            {user.details.location && <p><strong>Location:</strong> {user.details.location}</p>}
            {user.details.blog && (
              <p>
                <strong>Website:</strong>{' '}
                <a href={user.details.blog.startsWith('http') ? user.details.blog : `https://${user.details.blog}`}
                   target="_blank"
                   rel="noreferrer">
                  {user.details.blog}
                </a>
              </p>
            )}
            {user.details.twitter_username && (
              <p>
                <strong>Twitter:</strong>{' '}
                <a href={`https://twitter.com/${user.details.twitter_username}`} target="_blank" rel="noreferrer">
                  @{user.details.twitter_username}
                </a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }, [user]);

  /**
   * Мемоизированный компонент для отображения репозиториев
   */
  const RepositoriesList = useMemo(() => {
    if (!user || !user.repos.length) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.repos.map(({
                               id,
                               name,
                               description,
                               html_url,
                               forks,
                               open_issues,
                               watchers_count,
                               stargazers_count,
                             }: Repository) => (
              <Card key={id}>
                <CardHeader>
                  <CardTitle>
                    <a href={html_url} className="flex items-center gap-2 hover:underline" target="_blank"
                       rel="noreferrer">
                      <FaLink className="w-4 h-4" />
                      <span>{name}</span>
                    </a>
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { icon: <FaEye className="w-4 h-4" />, value: watchers_count, label: 'Watchers' },
                      { icon: <FaStar className="w-4 h-4" />, value: stargazers_count, label: 'Stars' },
                      { icon: <FaInfo className="w-4 h-4" />, value: open_issues, label: 'Issues' },
                      { icon: <FaUtensils className="w-4 h-4" />, value: forks, label: 'Forks' },
                    ].map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        {item.icon}
                        <span>{item.value}</span>
                        <span className="sr-only">{item.label}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }, [user]);

  // Отображение индикатора загрузки
  if (isLoading) {
    return <Spinner aria-label="Loading user information" />;
  }

  // Отображение сообщения об ошибке
  if (isError) {
    return (
      <div className="text-center" role="alert">
        <p className="text-red-500 font-bold">Error occurred while fetching user data</p>
        <Button onClick={handleGoBack} className="mt-4" variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {/* Кнопка возврата */}
      <Button onClick={handleGoBack} className="mb-4 max-w-max" aria-label="Go back to previous page">
        Go Back
      </Button>

      {/* Карточка с информацией о пользователе */}
      {isSuccess && user && (
        <>
          {/* Информация о пользователе */}
          {UserProfile}

          {/* Статистика пользователя */}
          {UserStats}

          {/* Информация о репозиториях */}
          {RepositoriesList}
        </>
      )}
    </div>
  );
};

export default DetailPage;