'use client';

import { JSX } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

/**
 * Интерфейс для опции селектора фильтра
 * @typedef {Object} FilterOption
 * @property {string} value - Значение опции
 * @property {string} label - Отображаемое название опции
 */
interface FilterOption {
  value: string;
  label: string;
}

/**
 * Интерфейс свойств компонента селектора фильтра
 * @typedef {Object} FilterSelectProps
 * @property {string} value - Текущее выбранное значение
 * @property {(value: string) => void} onValueChange - Обработчик изменения значения
 * @property {string} placeholder - Текст-заполнитель для селектора
 * @property {FilterOption[]} options - Массив опций для выбора
 * @property {string} [formatter] - Опциональная функция форматирования для отображения значений
 */
interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: FilterOption[];
  formatter?: (value: string) => string;
}

/**
 * Компонент селектора для фильтрации
 * @description Переиспользуемый компонент селектора для фильтров задач
 * @param {FilterSelectProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент селектора
 */
const FilterSelect = ({
                        value,
                        onValueChange,
                        placeholder,
                        options,
                        formatter,
                      }: FilterSelectProps): JSX.Element => {
  const displayValue = formatter ? formatter(value) : value;

  return (
    <Select value={displayValue} onValueChange={onValueChange}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;