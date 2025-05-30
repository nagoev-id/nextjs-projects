'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import React, { ChangeEvent, JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui';
import Image from 'next/image';
import { Countries, useGetQuery } from '@/app/projects/medium/countries-explorer/features';

/**
 * # Приложение для исследования стран
 *
 * ## Принцип работы:
 *
 * 1. **Загрузка данных**:
 *    - При монтировании компонента выполняется запрос к API для получения списка стран
 *    - Во время загрузки отображается индикатор загрузки (спиннер)
 *    - При ошибке загрузки показывается соответствующее сообщение
 *
 * 2. **Фильтрация стран**:
 *    - Пользователь может фильтровать страны по названию через поле поиска
 *    - Доступна фильтрация по региону через выпадающий список
 *    - Фильтры применяются в реальном времени при вводе или выборе
 *
 * 3. **Пагинация результатов**:
 *    - Результаты разбиты на страницы для улучшения производительности и UX
 *    - Пользователь может переключаться между страницами через навигацию
 *    - При изменении фильтров происходит автоматический возврат к первой странице
 *
 * 4. **Отображение стран**:
 *    - Каждая страна представлена карточкой с флагом и названием
 *    - При клике на карточку происходит переход на страницу с подробной информацией
 *
 * 5. **Оптимизация производительности**:
 *    - Используются мемоизированные функции для предотвращения лишних перерендеров
 *    - Применяется ленивая загрузка изображений для оптимизации загрузки страницы
 *    - Фильтрация и пагинация выполняются на клиенте для быстрого отклика интерфейса
 */

const ITEMS_PER_PAGE = 25;

/**
 * Компонент карточки страны
 *
 * @param {Object} props - Свойства компонента
 * @param {string} props.name - Название страны
 * @param {string} props.image - URL изображения флага страны
 * @param {number} props.index - Индекс карточки в списке
 * @returns {JSX.Element} Компонент карточки страны
 */
const CountryCard = React.memo(({ name, image, index }: {
  name: string;
  image: string;
  index: number
}): JSX.Element => (
  <Card className="p-0 gap-0 overflow-hidden rounded-sm dark:bg-accent">
    <Link href={`/projects/medium/countries-explorer/country/${name}`} aria-label={`View details for ${name}`}>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-[150px] object-cover border"
        src={image}
        alt={`Flag of ${name}`}
        priority={index < 4} // Приоритетная загрузка только для первых 4 изображений
        loading={index < 4 ? 'eager' : 'lazy'}
      />
      <h3 className="font-bold p-2">{name}</h3>
    </Link>
  </Card>
));


const CountriesExplorerPage = (): JSX.Element => {
  const { data: countries, isLoading, isError } = useGetQuery('');
  const [formState, setFormState] = useState<{ search: string; region: string }>({ search: '', region: '' });
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const regions = ['Africa', 'America', 'Asia', 'Europe', 'Oceania'];

  /**
   * Обрабатывает изменения в поле поиска с дебаунсом
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Событие изменения input
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  /**
   * Эффект для дебаунса поискового запроса
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormState(prev => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 300); // 300ms дебаунс

    return () => clearTimeout(timer);
  }, [searchInput]);

  /**
   * Обрабатывает изменения в выборе региона
   *
   * @param {string} value - Выбранное значение региона
   */
  const handleRegionChange = useCallback((value: string) => {
    setFormState(prev => ({ ...prev, region: value }));
    setCurrentPage(1);
  }, []);

  /**
   * Фильтрует страны на основе выбранного региона и поискового запроса.
   *
   * @type {Country[] | undefined}
   */
  const filteredCountries: Countries | undefined = useMemo(() => {
    return countries?.filter((country) =>
      (formState.region === 'all' || !formState.region || country.region.includes(formState.region)) &&
      (!formState.search || country.name.toLowerCase().includes(formState.search.toLowerCase())),
    );
  }, [countries, formState.search, formState.region]);

  /**
   * Общее количество страниц для пагинации.
   *
   * @type {number}
   */
  const totalPages: number = Math.ceil((filteredCountries?.length ?? 0) / ITEMS_PER_PAGE);

  /**
   * Возвращает подмножество стран для текущей страницы.
   *
   * @type {Country[] | undefined}
   */
  const paginatedCountries: Countries | undefined = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCountries?.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCountries, currentPage]);

  /**
   * Обрабатывает изменение текущей страницы.
   *
   * @param {number} page - Номер новой страницы.
   */
  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

  /**
   * Генерирует массив номеров страниц для отображения в пагинации
   * Показывает текущую страницу, несколько страниц до и после нее,
   * а также первую и последнюю страницы с разделителями
   */
  const pageNumbers = useMemo(() => {
    const delta = 2; // Количество страниц до и после текущей
    const range = [];
    const rangeWithDots = [];
    let l;

    // Если страниц мало, показываем все
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Всегда включаем первую страницу
    range.push(1);

    // Определяем диапазон страниц вокруг текущей
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Всегда включаем последнюю страницу
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Добавляем разделители
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  /**
   * Определяет содержимое для отображения в зависимости от состояния загрузки и данных
   */
  const renderContent = () => {
    if (isLoading) {
      return <Spinner aria-label="Loading countries" />;
    }

    if (isError) {
      return (
        <p className="text-red-500 font-bold text-center" role="alert">
          Failed to load countries. Please try again later.
        </p>
      );
    }

    if (!filteredCountries || filteredCountries.length === 0) {
      return (
        <p className="text-center font-medium" role="status">
          No countries found matching your criteria. Try adjusting your search or filters.
        </p>
      );
    }

    return (
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="list">
        {paginatedCountries?.map(({ name, flags: { svg: image } }, index) => (
          <li key={name}>
            <CountryCard name={name} image={image} index={index} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="grid gap-3 p-4">
      {/* Фильтры поиска и выбора региона */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2 md:justify-between">
        {/* Поле поиска */}
        <label htmlFor="search-input" className="sr-only">Search for a country</label>
        <Input
          id="search-input"
          type="text"
          name="search"
          placeholder="Search for a country..."
          value={searchInput}
          onChange={handleSearchChange}
          aria-label="Search for a country"
        />

        {/* Выбор региона */}
        <Select
          defaultValue={formState.region}
          onValueChange={handleRegionChange}
          aria-label="Select a region"
        >
          <SelectTrigger aria-label="Open region selection" className="w-full">
            <SelectValue placeholder="Select a Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Основное содержимое: список стран или сообщения о состоянии */}
      {renderContent()}

      {/* Пагинация - отображается только если есть страны */}
      {filteredCountries && filteredCountries.length > 0 && (
        <nav aria-label="Pagination" className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Кнопка "Предыдущая страница" */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
                  aria-label="Go to previous page"
                />
              </PaginationItem>

              {/* Номера страниц с оптимизированным отображением */}
              {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(Number(page))}
                      isActive={currentPage === Number(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === Number(page) ? 'page' : undefined}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Кнопка "Следующая страница" */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage >= totalPages}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : undefined}
                  aria-label="Go to next page"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </nav>
      )}

      {/* Информация о количестве найденных стран */}
      {filteredCountries && (
        <p className="text-center text-sm text-muted-foreground" role="status">
          Showing {paginatedCountries?.length || 0} of {filteredCountries.length} countries
          {formState.search || formState.region ? ' (filtered results)' : ''}
        </p>
      )}
    </Card>
  );
};

export default CountriesExplorerPage;
