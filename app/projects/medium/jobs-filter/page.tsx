'use client';

/**
 * # Приложение для фильтрации вакансий
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние:**
 *    - Приложение использует React с хуками (useState, useCallback, useMemo) и Redux для управления состоянием.
 *    - Основное состояние включает список вакансий, фильтры и поисковый запрос.
 *
 * 2. **Загрузка данных:**
 *    - Вакансии загружаются из Redux store с помощью селектора selectVisiblePositions.
 *    - Логотипы компаний импортируются и мапятся на названия компаний для легкого доступа.
 *
 * 3. **Фильтрация вакансий:**
 *    - Пользователь может добавлять фильтры, кликая на бейджи с навыками в карточках вакансий.
 *    - Фильтры можно удалять индивидуально или все сразу.
 *    - Список вакансий фильтруется на основе выбранных фильтров с помощью Redux.
 *
 * 4. **Поиск:**
 *    - Реализован поиск по ключевым словам, который фильтрует вакансии по позиции, компании, локации, языкам и инструментам.
 *    - Поиск работает в реальном времени, обновляя список при вводе.
 *
 * 5. **Отображение вакансий:**
 *    - Вакансии отображаются в виде карточек с информацией о позиции, компании, требованиях и т.д.
 *    - Карточки содержат интерактивные бейджи для добавления фильтров.
 *
 * 6. **Оптимизация производительности:**
 *    - Используются мемоизированные колбэки (useCallback) для оптимизации рендеринга.
 *    - Фильтрация списка вакансий оптимизирована с помощью useMemo.
 *
 * 7. **Адаптивный дизайн:**
 *    - Интерфейс адаптируется к различным размерам экрана с помощью классов Tailwind CSS.
 *
 * 8. **Доступность:**
 *    - Используются семантические HTML-теги и ARIA-атрибуты для улучшения доступности.
 *
 * Приложение предоставляет удобный интерфейс для поиска и фильтрации вакансий,
 * позволяя пользователям быстро находить подходящие предложения работы.
 */

import { ChangeEvent, JSX, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import photosnap from './assets/photosnap.svg';
import manage from './assets/manage.svg';
import account from './assets/account.svg';
import myhome from './assets/myhome.svg';
import loopStudios from './assets/loop-studios.svg';
import faceit from './assets/faceit.svg';
import shortly from './assets/shortly.svg';
import insure from './assets/insure.svg';
import eyecamCo from './assets/eyecam-co.svg';
import theAirFilterCompany from './assets/the-air-filter-company.svg';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/jobs-filter/app/store';
import {
  addFilter,
  clearFilters,
  removeFilter,
  selectFiltersData,
  selectVisiblePositions,
} from '@/app/projects/medium/jobs-filter/features';
import { Job } from '@/app/projects/medium/jobs-filter/mock';

/**
 * Карта логотипов компаний.
 * @type {Object.<string, any>}
 */
const logoMap: { [key: string]: any } = {
  photosnap,
  manage,
  account,
  myhome,
  'loop studios': loopStudios,
  faceit,
  shortly,
  insure,
  'eyecam co.': eyecamCo,
  'the air filter company': theAirFilterCompany,
};

/**
 * Компонент страницы фильтрации вакансий.
 * @returns {JSX.Element} Отрендеренная страница с фильтрами и списком вакансий.
 */
const JobsFilterPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(selectFiltersData);
  const positions = useAppSelector(selectVisiblePositions(filters));
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Обработчик добавления фильтра.
   * @param {string} filter - Фильтр для добавления.
   */
  const handleAddFilter = useCallback((filter: string) => {
    dispatch(addFilter(filter));
  }, [dispatch]);

  /**
   * Обработчик удаления фильтра.
   * @param {string} filter - Фильтр для удаления.
   */
  const handleDeleteFilter = useCallback((filter: string) => {
    dispatch(removeFilter(filter));
  }, [dispatch]);

  /**
   * Обработчик очистки всех фильтров.
   */
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setSearchTerm('');
  }, [dispatch]);

  /**
   * Обработчик изменения поискового запроса.
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения ввода.
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  /**
   * Отфильтрованный список вакансий на основе поискового запроса.
   */
  const filteredPositions = useMemo(() =>
    positions.filter(job =>
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  [positions, searchTerm]);

  /**
   * Рендерит бейджи активных фильтров.
   * @returns {JSX.Element} Список бейджей фильтров.
   */
  const renderFilterBadges = () => (
    <ul className="flex flex-wrap gap-1.5">
      {filters.map((filter) => (
        <li key={filter} onClick={() => handleDeleteFilter(filter)}>
          <Badge className="cursor-pointer">{filter}</Badge>
        </li>
      ))}
    </ul>
  );

  /**
   * Рендерит карточку вакансии.
   * @param {Job} job - Объект вакансии.
   * @returns {JSX.Element} Карточка вакансии.
   */
  const renderJobCard = (job: Job) => {
    const {
      id,
      company,
      new: isNew,
      featured,
      position,
      role,
      level,
      postedAt,
      contract,
      location,
      languages,
      tools,
    } = job;
    const badges = [role, level, ...languages, ...tools];

    return (
      <li key={id}>
        <Card className={`grid gap-3 p-3 md:grid-cols-[88px_1fr] ${featured ? 'bg-slate-100 dark:bg-accent' : ''}`}>
          <Image
            width={88}
            height={88}
            src={logoMap[company.toLowerCase()]}
            alt={`${company} logo`}
            priority={true}
          />
          <div className="grid gap-1.5">
            <h3 className="font-semibold">{position}</h3>
            <div className="grid gap-1.5">
              <span>{company}</span>
              <div className="flex flex-wrap gap-1.5">
                <Badge>{contract}</Badge>
                <Badge>{location}</Badge>
              </div>
            </div>
            {renderJobBadges(isNew, featured)}
            {renderSkillBadges(badges)}
            <p>{postedAt}</p>
          </div>
        </Card>
      </li>
    );
  };

  /**
   * Рендерит бейджи для новых и рекомендуемых вакансий.
   * @param {boolean} isNew - Флаг новой вакансии.
   * @param {boolean} featured - Флаг рекомендуемой вакансии.
   * @returns {JSX.Element|null} Бейджи или null, если не применимо.
   */
  const renderJobBadges = (isNew: boolean, featured: boolean) => (
    (isNew || featured) && (
      <div className="flex flex-wrap gap-1.5">
        {isNew && <Badge variant="destructive">New</Badge>}
        {featured && <Badge variant="outline">Featured</Badge>}
      </div>
    )
  );

  /**
   * Рендерит бейджи навыков для вакансии.
   * @param {string[]} badges - Массив навыков.
   * @returns {JSX.Element} Список бейджей навыков.
   */
  const renderSkillBadges = (badges: string[]) => (
    <ul className="flex flex-wrap gap-1.5">
      {badges.map(item => (
        <Badge className="cursor-pointer" key={item} onClick={() => handleAddFilter(item)}>
          {item}
        </Badge>
      ))}
    </ul>
  );

  return (
    <Card className="p-4">
      <div className="grid gap-3">
        <Input
          type="text"
          placeholder="Search for jobs..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {filters.length > 0 && (
          <Card className="flex flex-col items-start gap-2 p-3">
            {renderFilterBadges()}
            <Button variant="destructive" onClick={handleClearFilters}>
              Clear all filters
            </Button>
          </Card>
        )}
        <h3 className="font-semibold text-lg">
          {filteredPositions.length} {filteredPositions.length === 1 ? 'job' : 'jobs'} found
        </h3>
        <ul className="grid gap-3 lg:grid-cols-2">
          {filteredPositions.map(renderJobCard)}
        </ul>
      </div>
    </Card>
  );
};

export default JobsFilterPage;