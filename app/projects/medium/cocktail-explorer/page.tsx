'use client';

/**
 * # Приложение "Cocktail Explorer"
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация данных**:
 *    - При загрузке компонента происходит инициализация хранилища Redux данными о коктейлях
 *    - Устанавливается полный список коктейлей и генерируется случайная выборка из 20 коктейлей
 *    - Форма поиска инициализируется с пустым значением и настраивается валидация с помощью Zod
 *
 * 2. **Отображение коктейлей**:
 *    - По умолчанию отображается сетка из случайно выбранных коктейлей
 *    - Каждый коктейль представлен карточкой с изображением, названием, типом бокала и информацией об алкоголе
 *    - Карточки адаптивно располагаются в сетке в зависимости от размера экрана (от 1 до 4 колонок)
 *
 * 3. **Поиск коктейлей**:
 *    - Пользователь может ввести название коктейля в поле поиска
 *    - При отправке формы выполняется поиск по всем доступным коктейлям
 *    - Поиск осуществляется по нескольким полям: название, категория, тип алкоголя, тип бокала и ингредиенты
 *    - Результаты поиска заменяют отображение случайных коктейлей
 *
 * 4. **Обработка результатов поиска**:
 *    - Если найдены совпадения, они отображаются в том же формате карточек
 *    - Если совпадений нет, отображается сообщение "No results found"
 *    - При наличии результатов появляется кнопка сброса поиска
 *
 * 5. **Сброс поиска**:
 *    - При нажатии на кнопку "Reset Search" форма очищается
 *    - Результаты поиска сбрасываются, и снова отображаются случайные коктейли
 *
 * 6. **Просмотр деталей коктейля**:
 *    - Каждая карточка содержит кнопку "Detail" для перехода к подробной информации
 *    - При клике происходит навигация на страницу с детальной информацией о выбранном коктейле
 *
 * 7. **Обработка ошибок**:
 *    - При возникновении ошибок во время поиска отображается уведомление с помощью toast
 *    - Ошибки логируются в консоль для отладки
 *
 * 8. **Управление состоянием**:
 *    - Состояние приложения управляется через Redux (с использованием RTK)
 *    - Для оптимизации производительности используются мемоизированные функции (useCallback)
 *    - Форма управляется с помощью react-hook-form с валидацией через Zod
 */

import { FormInput } from '@/components/layout';
import { Badge, Button, Card, CardContent, CardFooter, Form } from '@/components/ui';
import { JSX, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/cocktail-explorer/app';
import {
  searchDrinks,
  selectDrinksSliceData,
  setDrinks,
  setRandomDrinks,
  setSearchResults,
} from '@/app/projects/medium/cocktail-explorer/features';
import { Drink, drinks, formSchema, FormSchema } from '@/app/projects/medium/cocktail-explorer/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

/**
 * @description Главный компонент страницы поиска и отображения коктейлей
 * @returns {JSX.Element} Компонент страницы Cocktail Explorer
 */
const CocktailExplorerPage = (): JSX.Element => {
  /**
   * @description Диспетчер Redux для отправки действий
   */
  const dispatch = useAppDispatch();
  
  /**
   * @description Данные о коктейлях из Redux-хранилища
   * @type {Object}
   * @property {Drink[]} randomDrinks - Массив случайно выбранных коктейлей
   * @property {Drink[]|null} searchResults - Результаты поиска коктейлей
   */
  const { randomDrinks, searchResults } = useAppSelector(selectDrinksSliceData);
  
  /**
   * @description Инициализация формы поиска с валидацией Zod
   * @type {<FormSchema>}
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });
  
  /**
   * @description Эффект для инициализации данных при монтировании компонента
   */
  useEffect(() => {
    dispatch(setDrinks(drinks));
    dispatch(setRandomDrinks(drinks));
  }, [dispatch]);

  /**
   * @description Обработчик отправки формы поиска
   * @param {FormSchema} formData - Данные формы с названием коктейля для поиска
   */
  const onSubmit = useCallback(async (formData: FormSchema) => {
    try {
      await dispatch(searchDrinks(formData.name));
    } catch (error) {
      console.error('Failed to fetch cocktails:', error);
      toast.error('Failed to search for cocktails', { richColors: true });
    }
  }, [dispatch]);

  /**
   * @description Обработчик сброса результатов поиска
   */
  const handleResetClick = useCallback(() => {
    dispatch(setSearchResults(null));
    form.reset();
  }, [dispatch, form]);

  return (
    <Card className="p-4">
      {/* Форма поиска коктейлей */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-3 rounded-lg border-2 grid gap-2.5">
          <div className="grid gap-1.5">
            <FormInput
              form={form}
              name="name"
              label="Search for a Cocktail:"
              placeholder="For example: Mojito"
            />
            <Button className="max-w-max" type="submit">Submit</Button>
          </div>
          {searchResults && searchResults.length > 0 && (
            <Button variant="destructive" type="button" onClick={handleResetClick}>Reset Search</Button>
          )}
        </form>
      </Form>
      
      {/* Сообщение об отсутствии результатов */}
      {searchResults && searchResults.length === 0 && (
        <p className="text-gray-700 dark:text-gray-300">No results found.</p>
      )}
      
      {/* Отображение результатов поиска */}
      {searchResults && searchResults.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((drink: Drink) => (
            <Card key={drink.idDrink}>
              <CardContent className="p-2 flex flex-col items-start gap-1.5">
                <Image 
                  width="100" 
                  height="100" 
                  src={drink.strDrinkThumb} 
                  alt={drink.strDrink}
                  className="w-full object-cover rounded-md" 
                  priority 
                />
                <h3 className="font-semibold">{drink.strDrink}</h3>
                <p>{drink.strGlass}</p>
                <Badge>{drink.strAlcoholic}</Badge>
              </CardContent>
              <CardFooter className="p-2">
                <Button className="w-full whitespace-normal" asChild>
                  <Link href={`/projects/medium/cocktail-explorer/cocktail/${drink.idDrink}`}>Detail</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Отображение случайных коктейлей, если нет результатов поиска */}
      {!searchResults && randomDrinks.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {randomDrinks.map((drink: Drink) => (
            <Card key={drink.idDrink}>
              <CardContent className="p-2 flex flex-col items-start gap-1.5">
                <Image 
                  width="100" 
                  height="100" 
                  src={drink.strDrinkThumb} 
                  alt={drink.strDrink}
                  className="w-full object-cover rounded-md" 
                  priority 
                />
                <h3 className="font-semibold">{drink.strDrink}</h3>
                <p>{drink.strGlass}</p>
                <Badge>{drink.strAlcoholic}</Badge>
              </CardContent>
              <CardFooter className="p-2">
                <Button className="w-full" asChild>
                  <Link href={`/projects/medium/cocktail-explorer/cocktail/${drink.idDrink}`}>Detail</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CocktailExplorerPage;