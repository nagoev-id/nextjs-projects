'use client';

import { ChangeEvent, JSX, useCallback, useState } from 'react';
import { useAppDispatch } from '@/app/projects/medium/brewery-finder/app';
import { setBreweryFilter, useGetQuery } from '@/app/projects/medium/brewery-finder/features';
import { Button, Input, Label } from '@/components/ui';

/**
 * Компонент для фильтрации пивоварен.
 * @description Предоставляет интерфейс для фильтрации списка пивоварен по различным критериям.
 * Использует Redux для управления состоянием и RTK Query для получения данных.
 * @returns {JSX.Element} Отрендеренный компонент фильтрации.
 */
const FilterBrewery = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { refetch: getRandomBrewery } = useGetQuery();
  
  /**
   * Состояние для хранения текущего значения фильтра.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [filter, setFilter] = useState<string>('');

  /**
   * Обработчик изменения значения в поле ввода фильтра.
   * @param {ChangeEvent<HTMLInputElement>} e - Событие изменения input.
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    dispatch(setBreweryFilter(e.target.value));
  }, [dispatch]);

  /**
   * Обработчик сброса поиска и получения случайных пивоварен.
   * @returns {Promise<void>}
   */
  const handleResetSearch = useCallback(async () => {
    setFilter('');
    await getRandomBrewery();
  }, [getRandomBrewery]);

  return (
    <div className='grid gap-3 items-start'>
      <Label htmlFor='filter'>Filter by (name, address, country, city):</Label>
      <Input
        name="filter"
        id="filter"
        placeholder="Filter by (name, address, country, city)"
        value={filter}
        onChange={handleInputChange}
      />
      <Button className='max-w-max' onClick={handleResetSearch}>Reset search</Button>
    </div>
  );
};

export default FilterBrewery;