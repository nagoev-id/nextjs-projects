'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { JSX, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Meal, useGetByIdQuery } from '@/app/projects/medium/the-meal-explorer/features';

/**
 * Компонент страницы с подробной информацией о блюде
 * 
 * @type {React.FC}
 * @returns {JSX.Element} Отрендеренная страница с деталями блюда
 */
const DetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: meal, isLoading, isError, isSuccess } = useGetByIdQuery(id as string);

  /**
   * Обработчик для возврата на предыдущую страницу
   * 
   * @type {() => void}
   */
  const handleGoBack = useCallback(() => router.back(), [router]);

  /**
   * Мемоизированный список ингредиентов и их мер
   * 
   * @type {Array<{key: string, text: string}>}
   */
  const ingredients = useMemo(() => {
    if (!meal) return [];

    return Object.entries(meal)
      .filter(([key, value]) => key.startsWith('strIngredient') && value)
      .map(([key, value]) => {
        const ingredientIndex = key.replace('strIngredient', '');
        const measure = meal[`strMeasure${ingredientIndex}` as keyof Meal];
        const ingredientValue = typeof value === 'string' ? value : String(value);
        const measureValue = measure ? ` (${measure})` : '';

        return {
          key,
          text: `${ingredientValue}${measureValue}`,
        };
      });
  }, [meal]);

  return (
    <>
      <Button onClick={handleGoBack} className="mb-4 max-w-max">
        Go Back
      </Button>
      <Card className="p-4">
        {isError && (
          <p className="text-red-500 text-center py-4" role="alert">
            Error loading meal details. Please try again later.
          </p>
        )}

        {isLoading && <Spinner className="mx-auto my-8" aria-label="Loading meal details" />}

        {isSuccess && meal && (
          <div className="grid gap-3 sm:grid-cols-2 sm:place-items-start">
            <div className="relative w-full aspect-square">
              <Image
                fill
                className="rounded-md object-cover"
                src={meal.strMealThumb}
                alt={meal.strMeal}
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="grid gap-3">
              <h1 className="flex flex-col items-start">
                <Badge>Name</Badge>
                <span className="text-lg font-bold">{meal.strMeal}</span>
              </h1>
              <div className="flex flex-col items-start">
                <Badge>Category</Badge>
                <span>{meal.strCategory}</span>
              </div>
              <div className="flex flex-col items-start">
                <Badge>Area</Badge>
                <span>{meal.strArea}</span>
              </div>
              <div className="flex flex-col items-start">
                <Badge>Instructions</Badge>
                <p className="text-sm whitespace-pre-line">{meal.strInstructions}</p>
              </div>
              <div className="flex flex-col items-start">
                <Badge>Ingredients</Badge>
                <ul className="list-disc pl-5 mt-1">
                  {ingredients.map(({ key, text }) => (
                    <li key={key}>{text}</li>
                  ))}
                </ul>
              </div>
              {meal.strYoutube && (
                <div className="flex flex-col items-start">
                  <Badge>Video Tutorial</Badge>
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default DetailPage;