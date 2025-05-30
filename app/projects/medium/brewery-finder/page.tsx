'use client';

/**
 * # Приложение "Brewery Finder"
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и загрузка данных:**
 *    - При загрузке компонента выполняется запрос к API для получения списка пивоварен (useGetQuery).
 *    - Данные о пивоварнях хранятся в Redux store и доступны через useAppSelector.
 *
 * 2. **Поиск и фильтрация:**
 *    - Компонент SearchForm позволяет пользователям искать пивоварни по названию или городу.
 *    - FilterBrewery компонент предоставляет возможность фильтровать пивоварни по различным критериям.
 *    - Результаты поиска и фильтрации обновляют список отображаемых пивоварен.
 *
 * 3. **Отображение списка пивоварен:**
 *    - Список пивоварен отображается в виде сетки карточек.
 *    - Каждая карточка содержит основную информацию о пивоварне: название, тип, адрес, город, страну.
 *    - Для пивоварен с указанным телефоном и веб-сайтом отображаются соответствующие ссылки.
 *
 * 4. **Навигация и детали:**
 *    - Название каждой пивоварни является ссылкой на страницу с подробной информацией.
 *    - Ссылки на телефон и веб-сайт открываются в соответствующих приложениях или новой вкладке.
 *
 * 5. **Адаптивный дизайн:**
 *    - Использование Tailwind CSS для создания отзывчивого дизайна.
 *    - Сетка карточек адаптируется к различным размерам экрана (sm:grid-cols-2 lg:grid-cols-3).
 *
 * 6. **Доступность:**
 *    - Использование семантических HTML-тегов и ARIA-атрибутов для улучшения доступности.
 *    - Иконки имеют атрибут aria-hidden для корректной работы скринридеров.
 *
 * 7. **Обработка состояний:**
 *    - Отображение сообщения, если список пивоварен пуст.
 *    - Условный рендеринг элементов на основе наличия данных (например, телефон и веб-сайт).
 *
 * 8. **Оптимизация производительности:**
 *    - Использование Next.js для оптимизации загрузки страницы и маршрутизации.
 *    - Применение Redux для эффективного управления состоянием приложения.
 *
 * Приложение предоставляет удобный интерфейс для поиска и просмотра информации о пивоварнях,
 * с возможностью фильтрации и детального просмотра каждой пивоварни.
 */

import { Card } from '@/components/ui/card';
import { JSX } from 'react';
import { Brewery, selectBreweryData, useGetQuery } from '@/app/projects/medium/brewery-finder/features';
import { useAppSelector } from '@/app/projects/medium/brewery-finder/app';
import { FilterBrewery, SearchForm } from '@/app/projects/medium/brewery-finder/components';
import Link from 'next/link';
import { SiHomebrew } from 'react-icons/si';
import { RxExternalLink } from 'react-icons/rx';
import { Badge, Button } from '@/components/ui';

/**
 * BreweryPage компонент
 *
 * Отображает страницу со списком пивоварен, включая функции поиска и фильтрации.
 *
 * @returns {JSX.Element} Отрендеренная страница со списком пивоварен
 */
const BreweryPage = (): JSX.Element => {
  const { isSuccess } = useGetQuery();
  const { breweriesFiltered: items } = useAppSelector(selectBreweryData);

  return (
    <Card className="grid gap-4 p-2">
      <>
        <SearchForm />
        <FilterBrewery />
      </>
      {isSuccess && (
        <div className="grid gap-2 my-4">
          <div className="grid gap-2">
            <h2 className="font-bold text-lg">Breweries List:</h2>
            {items.length === 0 && <p className="text-center font-semibold">No breweries found.</p>}
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {items.map((brewery: Brewery) => (
                <Card
                  key={brewery.id}
                  role="listitem"
                  className="h-full items-start flex flex-col gap-1.5 justify-start dark:bg-accent shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow">
                  <h3>
                    <Button variant="link" className="p-0 text-md whitespace-normal">
                      <Link
                        className="flex gap-1 items-center text-left"
                        href={`/projects/medium/brewery-finder/brewery/${brewery.id}`}
                        aria-label={`View details for ${brewery.name}`}
                      >
                        <SiHomebrew size={20} aria-hidden="true" />
                        <span>{brewery.name}</span>
                      </Link>
                    </Button>
                  </h3>
                  <ul className="grid gap-1">
                    <li className="grid gap-1">
                      <Badge>Type:</Badge>
                      <p>{brewery.brewery_type}</p>
                    </li>
                    <li className="grid gap-1">
                      <Badge>Address:</Badge>
                      <p>
                        {brewery.address_1}
                        {brewery.address_2 && <>, {brewery.address_2}</>}
                        {brewery.address_3 && <>, {brewery.address_3}</>}
                      </p>
                    </li>
                    <li className="grid gap-1">
                      <Badge>City:</Badge>
                      <p>{brewery.city}, {brewery.state_province} {brewery.postal_code}</p>
                    </li>
                    <li className="grid gap-1">
                      <Badge>Country:</Badge>
                      <p>{brewery.country}</p>
                    </li>
                    {brewery.phone && (
                      <li className="grid gap-1 place-items-start">
                        <Badge>Phone:</Badge>
                        <Button variant="link" className="p-0 text-md whitespace-normal">
                          <Link href={`tel:${brewery.phone}`}>{brewery.phone}</Link>
                        </Button>
                      </li>
                    )}
                    {brewery.website_url && (
                      <li className="grid gap-1 place-items-start">
                        <Badge>Website:</Badge>
                        <Button variant="link" className="p-0 text-md whitespace-normal">
                          <Link
                            className="flex gap-1 items-center"
                            href={brewery.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <RxExternalLink aria-hidden="true" />
                            <span>Visit website</span>
                          </Link>
                        </Button>
                      </li>
                    )}
                  </ul>
                </Card>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BreweryPage;