'use client';

import { useParams, useRouter } from 'next/navigation';
import { JSX, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FaArrowLeftLong, FaGlobe, FaPhone } from 'react-icons/fa6';
import { Spinner } from '@/components/ui/spinner';
import { MdMyLocation } from 'react-icons/md';
import { SiHomebrew } from 'react-icons/si';
import { TbCategory } from 'react-icons/tb';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useGetByIdQuery } from '@/app/projects/medium/brewery-finder/features';

/**
 * Компонент страницы с детальной информацией о пивоварне.
 * @description Отображает подробную информацию о выбранной пивоварне, используя RTK Query для получения данных.
 * @returns {JSX.Element} Отрендеренная страница с деталями пивоварни.
 */
const DetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: breweryDetails, isLoading, isError, isSuccess } = useGetByIdQuery(id as string);

  /**
   * Обработчик для возврата на предыдущую страницу.
   * @type {() => void}
   */
  const handleGoBack = useCallback(() => router.back(), [router]);

  /**
   * Рендерит детальную информацию о пивоварне.
   * @returns {JSX.Element | null} Отрендеренная карточка с информацией о пивоварне или null, если данные отсутствуют.
   */
  const renderBreweryDetails = () => {
    if (!breweryDetails) return null;

    const {
      name,
      brewery_type,
      street,
      city,
      state_province,
      postal_code,
      country,
      phone,
      website_url,
    } = breweryDetails;

    return (
      <Card className="p-4 rounded-md shadow-md grid gap-2">
        {/* Название пивоварни */}
        <h2 className="font-bold inline-flex">
          <SiHomebrew className="text-amber-600 dark:text-amber-400" /> {name}
        </h2>

        {/* Тип пивоварни */}
        <p className="flex gap-2 items-center">
          <TbCategory />
          {brewery_type} brewery
        </p>

        <div className="grid">
          {/* Адрес пивоварни */}
          <p className="flex items-center gap-2">
            <MdMyLocation />
            <span>
              {street}, {city}, {state_province} {postal_code}, {country}
            </span>
          </p>

          {/* Телефон пивоварни (если есть) */}
          {phone && (
            <p className="flex items-center gap-2">
              <FaPhone/>
              <Button variant='link' className='p-0'>
                <Link href={`tel:${phone}`} target="_blank" rel="noopener noreferrer">{phone}</Link>
              </Button>
            </p>
          )}

          {/* Веб-сайт пивоварни (если есть) */}
          {website_url && (
            <p className="flex items-center gap-2">
              <FaGlobe/>
              <Button variant='link' className='p-0'>
                <Link href={website_url} target="_blank" rel="noopener noreferrer">{website_url}</Link>
              </Button>
            </p>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="grid gap-4">
      {/* Кнопка возврата на главную страницу */}
      <Button className="inline-flex gap-1 items-center max-w-max" onClick={handleGoBack}>
        <FaArrowLeftLong />
        Go Back
      </Button>

      {/* Индикатор загрузки */}
      {isLoading && <Spinner />}

      {/* Сообщение об ошибке */}
      {isError &&
        <p className="text-center font-medium text-lg text-red-500">An error occurred while fetching the brewery</p>}

      {/* Отображение деталей пивоварни при успешной загрузке */}
      {isSuccess && breweryDetails && renderBreweryDetails()}
    </div>
  );
};

export default DetailPage;