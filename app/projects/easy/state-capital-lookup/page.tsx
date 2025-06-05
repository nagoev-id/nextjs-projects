'use client';

/**
 * # State Capital Lookup
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация данных**:
 *    - Приложение загружает список штатов из JSON-файла с данными (аббревиатура, название, столица, координаты)
 *    - Состояние инициализируется с полным списком штатов и пустым поисковым запросом
 * 
 * 2. **Поиск и фильтрация**:
 *    - Пользователь вводит текст в поисковое поле
 *    - Введенный текст сохраняется в состоянии searchInput
 *    - Для оптимизации производительности используется дебаунсинг (300мс задержка)
 *    - После задержки выполняется фильтрация списка штатов по всем полям:
 *      - Аббревиатуре штата (abbr)
 *      - Названию штата (name)
 *      - Названию столицы (capital)
 *      - Широте (lat)
 *      - Долготе (long)
 *    - Поиск нечувствителен к регистру для текстовых полей
 * 
 * 3. **Отображение результатов**:
 *    - Отфильтрованные результаты отображаются в виде сетки карточек
 *    - Каждая карточка содержит:
 *      - Название штата и его аббревиатуру
 *      - Название столицы
 *      - Координаты (широта и долгота)
 *    - Сетка адаптивно меняется в зависимости от размера экрана:
 *      - 1 колонка на мобильных устройствах
 *      - 2 колонки на планшетах
 *      - 3 колонки на десктопах
 * 
 * 4. **Оптимизация производительности**:
 *    - Мемоизация функции обработчика ввода с помощью useCallback
 *    - Дебаунсинг поискового запроса для уменьшения количества операций фильтрации
 *    - Эффективное обновление состояния с использованием функционального подхода
 * 
 * Приложение предоставляет удобный интерфейс для быстрого поиска информации о штатах США,
 * включая их столицы и географические координаты, с оптимизированной производительностью
 * и адаптивным дизайном.
 */

import { ChangeEvent, JSX, useCallback, useEffect, useState } from 'react';
import { Card, Input, Label } from '@/components/ui';
import ListsOfStates from '@/app/projects/easy/state-capital-lookup/utils/mock.json';
import { useDebounce } from '@/shared/hooks';

/**
 * Интерфейс, описывающий структуру данных штата
 * @typedef {Object} State
 * @property {string} abbr - Аббревиатура штата (например, "CA", "NY")
 * @property {string} name - Полное название штата
 * @property {string} capital - Название столицы штата
 * @property {string} lat - Широта географического положения столицы
 * @property {string} long - Долгота географического положения столицы
 */
type State = {
  abbr: string,
  name: string,
  capital: string,
  lat: string,
  long: string
}

/**
 * Компонент поиска информации о штатах и их столицах
 * Позволяет пользователю искать штаты по названию, аббревиатуре, столице или координатам
 * и отображает соответствующую информацию в виде карточек
 * 
 * @returns {JSX.Element} Компонент страницы поиска информации о штатах
 */
const StateCapitalLookupPage = (): JSX.Element => {
  /**
   * Состояние компонента
   * @type {Object}
   * @property {State[]} states - Полный список штатов
   * @property {string} searchInput - Текущий поисковый запрос пользователя
   * @property {State[]} filteredStates - Отфильтрованный список штатов на основе поискового запроса
   */
  const [state, setState] = useState({
    states: ListsOfStates as State[],
    searchInput: '',
    filteredStates: ListsOfStates as State[],
  });

  /**
   * Дебаунсированная версия поискового запроса
   * Обновляется с задержкой в 300мс после последнего изменения searchInput
   * для оптимизации производительности при быстром вводе
   */
  const debouncedSearchInput = useDebounce(state.searchInput, 300);

  /**
   * Обработчик изменения значения в поисковом поле
   * Обновляет состояние searchInput при каждом вводе пользователя
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - Событие изменения значения в поле ввода
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value.toLowerCase().trim();
    setState(prevState => ({
      ...prevState,
      searchInput,
    }));
  }, []);

  /**
   * Эффект для фильтрации списка штатов при изменении дебаунсированного поискового запроса
   * Выполняет поиск по всем полям штата (аббревиатура, название, столица, координаты)
   */
  useEffect(() => {
    setState(prevState => {
      const filteredStates = prevState.states.filter(({ lat, long, capital, abbr, name }: State) => {
        return (
          abbr.toLowerCase().includes(debouncedSearchInput) ||
          capital.toLowerCase().includes(debouncedSearchInput) ||
          name.toLowerCase().includes(debouncedSearchInput) ||
          lat.includes(debouncedSearchInput) ||
          long.includes(debouncedSearchInput)
        );
      });
      return {
        ...prevState,
        filteredStates,
      };
    });
  }, [debouncedSearchInput]);

  return (
    <Card className="gap-3 p-4">
      <div className="grid gap-2">
        <Label htmlFor="state">
          Enter a state's abbreviation or name to find its capital, latitude, and longitude:
        </Label>
        <Input
          type="text"
          id="state"
          aria-label="Enter a state's abbreviation"
          placeholder="Enter a state's abbreviation"
          onChange={handleInputChange}
          value={state.searchInput}
        />
      </div>

      <ul className="grid gap-2 md:gap-3 sm:grid-cols-2 md:grid-cols-3">
        {state.filteredStates.map(({ lat, long, capital, abbr, name }: State) => (
          <li key={abbr}>
            <Card className="p-2 rounded gap-2">
              <h3 className="font-bold">{name} ({abbr}):</h3>
              <div className="grid gap-1.5">
                <p className="font-bold">{capital}</p>
                <p className="text-sm ">
                  <span className="font-medium">Lat:</span> {lat} / {' '}
                  <span className="font-medium">Long:</span> {long}
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default StateCapitalLookupPage;