'use client';

import { useParams, useRouter } from 'next/navigation';
import { JSX, memo, useCallback, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useGetByNameQuery } from '@/app/projects/medium/countries-explorer/features';

type CountryInfoProps = {
  label: string;
  value: string | number | undefined;
}

type BorderCountriesProps = {
  borders: string[];
}

/**
 * Компонент для отображения отдельного информационного поля о стране.
 * @param {string} label - Название поля
 * @param {string|number|undefined} value - Значение поля
 * @returns {JSX.Element} Отформатированная строка с меткой и значением.
 */
const CountryInfo = memo(function CountryInfo({ label, value }: CountryInfoProps): JSX.Element {
  return (
    <p className="flex flex-wrap gap-1.5">
      <span className="font-semibold">{label}:</span>{value || 'Not available'}
    </p>
  );
});

/**
 * Компонент для отображения списка граничащих стран.
 * @param {string[]} borders - Массив кодов граничащих стран
 * @returns {JSX.Element} Список граничащих стран или сообщение об их отсутствии.
 */
const BorderCountries = memo(function BorderCountries({ borders }: BorderCountriesProps): JSX.Element {
  // Проверяем наличие граничащих стран с помощью оптимизированного условия
  const hasBorders = borders?.length > 0;

  return (
    <div className="grid gap-2 text-sm mt-4">
      <p className="font-bold">Border Countries:</p>
      {hasBorders ? (
        <ul className="flex flex-wrap gap-1.5">
          {borders.map((border: string) => (
            <Link
              href={`/projects/medium/countries-explorer/country/${border}`}
              key={border}
              aria-label={`View details for ${border}`}
            >
              <Button variant="secondary">
                {border}
              </Button>
            </Link>
          ))}
        </ul>
      ) : (
        <p>There is no border country</p>
      )}
    </div>
  );
});

/**
 * Страница с детальной информацией о стране
 * @returns {JSX.Element} Компонент страницы с информацией о стране
 */
const DetailPage = (): JSX.Element | null => {
  const { name } = useParams<{ name: string }>();
  const router = useRouter();
  const { data: country, isLoading, isError, isSuccess } = useGetByNameQuery(name as string);

  /**
   * Обработчик для возврата на предыдущую страницу.
   * Использует useCallback для мемоизации функции.
   */
  const handleGoBack = useCallback(() => router.back(), [router]);

  /**
   * Мемоизированные данные о стране.
   * Извлекает и структурирует необходимые данные из полученного объекта страны.
   */
  const countryData = useMemo(() => {
    if (!country) return null;
    const {
      flag,
      nativeName,
      capital,
      population,
      region,
      subregion,
      topLevelDomain = [],
      currencies = [] as { name: string; symbol: string }[],
      languages = [],
      borders = [],
    } = country;
    return { flag, nativeName, capital, population, region, subregion, topLevelDomain, currencies, languages, borders };
  }, [country]);

  /**
   * Мемоизированный массив основной информации о стране.
   * Каждый элемент содержит метку и соответствующее значение.
   */
  const mainInfoItems = useMemo(() => [
    { label: 'Native Name', value: countryData?.nativeName },
    { label: 'Population', value: countryData?.population?.toLocaleString() },
    { label: 'Region', value: countryData?.region },
    { label: 'Sub Region', value: countryData?.subregion },
    { label: 'Capital', value: countryData?.capital },
  ], [countryData]);

  // Отображение индикатора загрузки
  if (isLoading) {
    return <Spinner aria-label="Loading country information" />;
  }

  // Отображение сообщения об ошибке
  if (isError) {
    return (
      <p className="text-red-500 font-bold text-center" role="alert">
        Error occurred while fetching country data
      </p>
    );
  }

  // Если данные не загружены, не отображаем ничего
  if (!isSuccess || !countryData) {
    return null;
  }

  const decodedCountryName = decodeURIComponent(name as string);

  return (
    <>
      {/* Кнопка возврата */}
      <Button
        onClick={handleGoBack}
        className="mb-4 max-w-max"
        aria-label="Go back to previous page"
      >
        Go Back
      </Button>

      {/* Карточка с информацией о стране */}
      <Card className="p-4">
        <div className="grid gap-4 sm:items-center lg:grid-cols-[50%_1fr] lg:gap-10">
          {/* Флаг страны */}
          <div className="rounded border-2">
            <Image
              className="w-full object-cover"
              src={countryData.flag}
              alt={`Flag of ${decodedCountryName}`}
              loading="lazy"
              width={500}
              height={300}
            />
          </div>

          {/* Детальная информация о стране */}
          <div>
            <h1 className="text-lg md:text-2xl font-bold mb-3">{decodedCountryName}</h1>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              {/* Основная информация */}
              <div className="flex flex-col gap-0.5">
                {mainInfoItems.map(({ label, value }) => (
                  <CountryInfo key={label} label={label} value={value} />
                ))}
              </div>
              {/* Дополнительная информация */}
              <div className="flex flex-col gap-0.5">
                <CountryInfo
                  label="Top Level Domain"
                  value={countryData.topLevelDomain.join(', ')}
                />
                <CountryInfo
                  label="Currency"
                  value={
                    Array.isArray(countryData.currencies) && countryData.currencies.length > 0
                      ? countryData.currencies[0]?.name
                      : 'Not found'
                  }
                />
                <CountryInfo
                  label="Languages"
                  value={
                    Array.isArray(countryData.languages) && countryData.languages.length > 0
                      ? countryData.languages.map((lang: {
                        name: string;
                        nativeName: string
                      }) => lang.name).join(', ')
                      : 'Not found'
                  }
                />
              </div>
            </div>
            {/* Список граничащих стран */}
            <BorderCountries borders={countryData.borders} />
          </div>
        </div>
      </Card>
    </>
  );
};

export default DetailPage;