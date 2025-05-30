'use client';

import { JSX, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Post, Posts } from '@/app/projects/medium/twitty-microposts/features';
import { Card } from '@/components/ui';
import { DeletePostDialog, EditPostDialog } from '@/app/projects/medium/twitty-microposts/components';

/**
 * Интерфейс для пропсов компонента PostsList.
 * @interface
 */
interface PostsList {
  /** Массив постов для отображения */
  posts: Posts;
  /** Текущее значение фильтра */
  filter: string;
  /** Функция для обновления значения фильтра */
  setFilter: (filter: string) => void;
}

/**
 * Компонент для отображения списка постов с возможностью фильтрации.
 * 
 * @type {React.FC<PostsList>}
 * @param {Object} props - Пропсы компонента
 * @param {Posts} props.posts - Массив постов для отображения
 * @param {string} props.filter - Текущее значение фильтра
 * @param {function} props.setFilter - Функция для обновления значения фильтра
 * @returns {JSX.Element} Отрендеренный список постов
 */
const PostsList = ({ posts, filter, setFilter }: PostsList): JSX.Element => {
  /** Состояние для управления открытием/закрытием диалога редактирования */
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  /**
   * Мемоизированный список отфильтрованных постов.
   * Фильтрация происходит по заголовку и содержимому поста.
   */
  const filteredPosts = useMemo(() => {
    return posts?.filter(post =>
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.body.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [posts, filter]);

  return (
    <div className="grid gap-4">
      <Label className="grid gap-2">
        <span>Filter Posts:</span>
        <Input
          value={filter}
          placeholder="Filter posts by title and body"
          onChange={(e) => setFilter(e.target.value)}
        />
      </Label>
      <div className="grid gap-2">
        {filteredPosts && filteredPosts.length > 0 && <h3 className="font-bold text-lg">Latest Posts:</h3>}
        <ul className="grid gap-3">
          {filteredPosts?.map((post: Post) => (
            <li key={post.id}>
              <Card className="grid gap-2 p-4 rounded border">
                <h3 className="font-bold text-xl">{post.title}</h3>
                <p>{post.body}</p>
                <div className="flex flex-wrap ml-auto gap-2">
                  <EditPostDialog
                    post={post}
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                  />
                  <DeletePostDialog postId={post.id} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostsList;