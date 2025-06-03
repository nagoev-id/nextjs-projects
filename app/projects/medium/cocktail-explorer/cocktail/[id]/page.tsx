'use client';

import { useParams, useRouter } from 'next/navigation';
import { JSX, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { drinks } from '@/app/projects/medium/cocktail-explorer/utils';
import { Badge, Button, Card } from '@/components/ui';

/**
 * @typedef {Object} CocktailParams
 * @property {string} id - Идентификатор коктейля
 */

/**
 * @description Компонент страницы детальной информации о коктейле
 * @returns {JSX.Element} Компонент страницы с информацией о коктейле
 */
const DetailPage = (): JSX.Element => {
  /**
   * @description Получение параметра id из URL
   * @type {string}
   */
  const { id } = useParams<{ id: string }>();
  
  /**
   * @description Инстанс роутера для навигации
   */
  const router = useRouter();
  
  /**
   * @description Поиск коктейля по id в списке доступных коктейлей
   * @type {Object|undefined}
   */
  const cocktail = useMemo(() => drinks.find(drink => drink.idDrink === id), [id]);
  
  /**
   * @description Обработчик для возврата на предыдущую страницу
   * @type {Function}
   */
  const handleGoBack = useCallback(() => router.back(), [router]);

  // Если коктейль не найден, показываем сообщение об ошибке
  if (!cocktail) {
    return <p>Error loading cocktail</p>;
  }

  /**
   * @description Извлечение списка ингредиентов из объекта коктейля
   * @type {Array<string>}
   * @example
   * // Возвращает массив строк, например:
   * // ['Водка', 'Апельсиновый сок', 'Лед']
   */
  const ingredients = useMemo(() => {
    return Object.entries(cocktail)
      .filter(([key, value]) => key.startsWith('strIngredient') && value)
      .map(([, value]) => value);
  }, [cocktail]);

  return (
    <>
      <Button onClick={handleGoBack} className="mb-4 max-w-max">
        Go Back
      </Button>
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 sm:place-items-start">
          <Image
            width="100"
            height="100"
            className="w-full object-cover rounded-md"
            src={cocktail.strDrinkThumb}
            alt={cocktail.strDrink}
            priority
          />
          <div className="grid gap-3">
            <h1 className="flex flex-col items-start">
              <Badge>Name</Badge>
              <span className="text-lg font-bold">{cocktail.strDrink}</span>
            </h1>
            <div className="flex flex-col items-start">
              <Badge>Category</Badge>
              <span>{cocktail.strCategory}</span>
            </div>
            <div className="flex flex-col items-start">
              <Badge>Info</Badge>
              <span>{cocktail.strAlcoholic}</span>
            </div>
            <div className="flex flex-col items-start">
              <Badge>Glass</Badge>
              <span>{cocktail.strGlass}</span>
            </div>
            <div className="flex flex-col items-start">
              <Badge>Instructions</Badge>
              <span>{cocktail.strInstructions}</span>
            </div>
            <div className="flex flex-col items-start">
              <Badge>Ingredients</Badge>
              {ingredients.map(i => <span key={i}> - {i},</span>)}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DetailPage;