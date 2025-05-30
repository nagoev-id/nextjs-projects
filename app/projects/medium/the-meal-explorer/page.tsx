'use client';

/**
 * # Приложение "The Meal Explorer"
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние:**
 *    - Приложение использует React с хуками для управления состоянием и эффектами.
 *    - Основное состояние включает результаты поиска блюд и случайные блюда.
 *    - Используется RTK Query для выполнения API-запросов (useLazyGetByNameQuery, useGetRandomMealsQuery).
 *
 * 2. **Форма поиска:**
 *    - Реализована форма поиска блюд с использованием react-hook-form и валидацией Zod.
 *    - При отправке формы выполняется поиск блюд по введенному названию.
 *
 * 3. **Отображение результатов:**
 *    - Результаты поиска или случайные блюда отображаются в виде сетки карточек.
 *    - Каждая карточка содержит изображение, название, регион, категорию блюда и кнопку для получения дополнительной информации.
 *
 * 4. **Управление состоянием поиска:**
 *    - Результаты поиска сохраняются в локальном состоянии и обновляются при новом поиске.
 *    - Реализована возможность сброса результатов поиска и возврата к отображению случайных блюд.
 *
 * 5. **Обработка ошибок и загрузки:**
 *    - Отображаются индикаторы загрузки во время выполнения запросов.
 *    - При возникновении ошибок показываются соответствующие сообщения.
 *
 * 6. **Адаптивный дизайн:**
 *    - Использованы классы Tailwind CSS для создания отзывчивого макета, адаптирующегося к различным размерам экрана.
 *
 * 7. **Навигация:**
 *    - Каждая карточка блюда содержит ссылку на страницу с подробной информацией о блюде.
 *
 * 8. **Оптимизация производительности:**
 *    - Используются мемоизированные колбэки (useCallback) для оптимизации рендеринга.
 *    - Компоненты карточек блюд рендерятся с использованием мемоизированной функции.
 *
 * Приложение предоставляет удобный интерфейс для поиска и просмотра информации о различных блюдах,
 * позволяя пользователям исследовать кулинарные рецепты со всего мира.
 */

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { JSX, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import {
  Meal,
  Meals,
  useGetRandomMealsQuery,
  useLazyGetByNameQuery,
} from '@/app/projects/medium/the-meal-explorer/features';
import { formSchema, FormSchema } from '@/app/projects/medium/the-meal-explorer/utils';
import { toast } from 'sonner';
import { Form } from '@/components/ui';
import { FormInput } from '@/components/layout';

/**
 * MealExplorerPage компонент
 * 
 * Основной компонент страницы для поиска и отображения информации о блюдах.
 * 
 * @returns {JSX.Element} Отрендеренная страница приложения The Meal Explorer
 */
const MealExplorerPage = (): JSX.Element => {
  // RTK Query хуки для получения данных
  const [searchMealByName, { data: searchResults, isLoading, isError, isSuccess }] = useLazyGetByNameQuery();
  const {
    data: randomMeals,
    isLoading: isLoadingRandom,
    isError: isErrorRandom,
    isSuccess: isSuccessRandom,
  } = useGetRandomMealsQuery();

  // Локальное состояние для хранения результатов поиска
  const [searchResultsData, setSearchResultsData] = useState<Meals | null>(null);

  // Инициализация формы с использованием react-hook-form и Zod валидацией
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  // Эффект для обновления локального состояния при получении результатов поиска
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setSearchResultsData(searchResults);
    }
  }, [searchResults]);

  /**
   * Обработчик отправки формы поиска
   * 
   * @param {FormSchema} formData - Данные формы
   */
  const onSubmit = useCallback(async (formData: FormSchema) => {
    try {
      const response = await searchMealByName(formData.name);
      if (response.data && response.data.length > 0) {
        toast.success('Meals found!', { richColors: true });
      }
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      toast.error('Failed to search for meals', { richColors: true });
    }
  }, [searchMealByName]);

  /**
   * Обработчик сброса результатов поиска
   */
  const handleResetClick = useCallback(() => {
    setSearchResultsData(null);
    form.reset();
  }, [form]);

  /**
   * Функция рендеринга карточки блюда
   * 
   * @param {Meal} meal - Данные о блюде
   * @returns {JSX.Element} Отрендеренная карточка блюда
   */
  const renderMealCard = useCallback((meal: Meal) => (
    <Card className="h-full flex flex-col p-0 gap-0" key={meal.idMeal}>
      <CardContent className="p-2 flex flex-col items-start gap-1.5">
        <Image width={100} height={100} priority src={meal.strMealThumb} alt={meal.strMeal}
               className="rounded-md w-full" />
        <h3 className="font-semibold">{meal.strMeal}</h3>
        <p>{meal.strArea}</p>
        <Badge>{meal.strCategory}</Badge>
      </CardContent>
      <CardFooter className="p-2 mt-auto">
        <Button className="w-full" asChild>
          <Link href={`/projects/medium/the-meal-explorer/meal/${meal.idMeal}`}>More Info</Link>
        </Button>
      </CardFooter>
    </Card>
  ), []);

  return (
    <Card className="grid gap-4 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-3 rounded-lg border-2 grid gap-2.5">
          <div className="grid gap-2">
            <FormInput form={form} name="name" label="Search for a Meal:" placeholder="For example: Arrabiata" />
            <div className="grid gap-2 sm:flex">
              <Button className="max-w-max" type="submit">Submit</Button>
              {isSuccess && searchResultsData && searchResultsData.length > 0 && (
                <Button variant="destructive" type="button" onClick={handleResetClick}>Reset Search</Button>
              )}
            </div>
          </div>
        </form>
      </Form>

      {(isError || isErrorRandom) && (
        <p>Error while fetching meal data.</p>
      )}

      {(isLoadingRandom || isLoading) && <Spinner />}

      {searchResultsData && searchResultsData.length === 0 && (
        <p>No results found.</p>
      )}

      {searchResultsData && searchResultsData.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResultsData.map(renderMealCard)}
        </div>
      )}

      {!searchResultsData && isSuccessRandom && randomMeals && randomMeals.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {randomMeals.map(renderMealCard)}
        </div>
      )}
    </Card>
  );
};

export default MealExplorerPage;