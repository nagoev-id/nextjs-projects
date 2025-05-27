'use client';

/**
 * # Приложение для управления отзывами
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация и загрузка данных**:
 *    - При монтировании компонента выполняется запрос на получение всех отзывов с помощью хука useGetReviewsQuery.
 *    - Пока данные загружаются, отображается индикатор загрузки (Spinner).
 * 
 * 2. **Отображение формы для создания отзыва**:
 *    - В верхней части страницы располагается форма ReviewForm для создания нового отзыва.
 *    - Пользователь может ввести текст отзыва и выбрать рейтинг.
 * 
 * 3. **Отображение списка отзывов**:
 *    - После успешной загрузки отображается список всех отзывов.
 *    - Для каждого отзыва показывается рейтинг, текст и кнопки для редактирования и удаления.
 *    - Отзывы отображаются в виде карточек с использованием компонента Card.
 * 
 * 4. **Статистика отзывов**:
 *    - Над списком отзывов отображается общее количество отзывов и средний рейтинг.
 *    - Средний рейтинг вычисляется с помощью функции averageRating.
 * 
 * 5. **Редактирование отзыва**:
 *    - При нажатии на кнопку редактирования открывается диалоговое окно EditPostDialog.
 *    - В диалоговом окне пользователь может изменить текст и рейтинг отзыва.
 * 
 * 6. **Удаление отзыва**:
 *    - При нажатии на кнопку удаления открывается диалоговое окно подтверждения (AlertDialog).
 *    - Если пользователь подтверждает удаление, вызывается функция handleDeleteReview.
 * 
 * 7. **Обработка ошибок**:
 *    - В случае ошибки при загрузке данных отображается сообщение об ошибке.
 * 
 * 8. **Оптимизация производительности**:
 *    - Используется useCallback для мемоизации функции вычисления среднего рейтинга.
 *    - Компоненты оптимизированы для минимизации ненужных ререндеров.
 */

import { JSX, useCallback, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  Spinner,
} from '@/components/ui';
import { useDeleteReviewMutation, useGetReviewsQuery } from '@/app/projects/medium/feedback-form/features';
import { EditPostDialog, ReviewForm } from '@/app/projects/medium/feedback-form/components';
import { Trash2 } from 'lucide-react';

/**
 * Компонент страницы отзывов
 * @returns {JSX.Element} Отрендеренная страница отзывов
 */
const FeedbackPage = (): JSX.Element => {
  const { data: reviewsData, isError, isLoading, isSuccess } = useGetReviewsQuery();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [handleDeleteReview] = useDeleteReviewMutation();

  /**
   * Вычисляет средний рейтинг отзывов
   * @returns {string} Средний рейтинг с одним знаком после запятой или '0' если отзывов нет
   */
  const averageRating = useCallback(() => {
    if (!reviewsData || reviewsData.length === 0) {
      return '0';
    }
    const sum = reviewsData.reduce((a, r) => {
      return a + parseInt(r.rating, 10);
    }, 0);
    return (sum / reviewsData.length).toFixed(1);
  }, [reviewsData]);

  return (
    <Card className="max-w-2xl w-full mx-auto p-4 rounded border-none shadow-none bg-card-none">
      {/* Форма для создания нового отзыва */}
      <ReviewForm />

      {/* Индикатор загрузки */}
      {isLoading && <Spinner />}

      {/* Сообщение об ошибке */}
      {isError && <div className="text-center text-red-500 font-semibold">An error occurred while loading reviews</div>}

      {/* Отображение списка отзывов */}
      {isSuccess && reviewsData && (
        <div className="grid gap-2 relative">
          {/* Статистика отзывов */}
          <div className="flex flex-wrap justify-between gap-3 font-semibold my-4">
            <p>{reviewsData.length} reviews</p>
            <p>Average Rating: {averageRating()}</p>
          </div>
          {/* Список отзывов */}
          <div className="grid gap-3">
            {reviewsData.map(({ review, rating, id }) => (
              <Card key={id} className="grid gap-3 relative rounded-md border p-5 min-h-[100px]">
                {/* Отображение рейтинга */}
                <div
                  className="absolute right-1 top-1 flex h-[33px] w-[33px] items-center justify-center rounded-full bg-neutral-900 text-white font-bold dark:bg-neutral-600">
                  {rating}
                </div>
                {/* Текст отзыва */}
                <div>
                  <h2 className="font-semibold">Description:</h2>
                  <p className="break-all">{review}</p>
                </div>
                {/* Кнопки действий */}
                <div className="grid sm:grid-cols-2 gap-2">
                  {/* Диалог редактирования отзыва */}
                  <EditPostDialog
                    post={{ review, rating, id }}
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                  />
                  {/* Диалог подтверждения удаления */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive"><Trash2 /> Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your feedback.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => await handleDeleteReview(id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FeedbackPage;